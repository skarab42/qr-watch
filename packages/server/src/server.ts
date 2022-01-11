import path from "path";
import open from "open";
import watcher from "@parcel/watcher";
import { ensureDirSync } from "fs-extra";
import staticPlugin from "fastify-static";
import fastify, { FastifyInstance } from "fastify";
import wsPlugin, { SocketStream } from "fastify-websocket";

import type { Message } from "@qr-watch/types";

export interface Settings {
  dev?: boolean;
  port?: number;
  wsPath?: string;
  publicPath: string;
  clientPath: string;
  outputPath: string;
}

export default class Server {
  readonly dev: boolean = false;
  readonly port: number = 3000;
  readonly wsPath: string = "/ws";
  readonly publicPath: string;
  readonly clientPath: string;
  readonly outputPath: string;

  readonly url: string;
  readonly fastify: FastifyInstance;

  constructor(settings: Settings) {
    this.dev = settings.dev ?? this.dev;
    this.port = settings.port ?? this.port;
    this.wsPath = settings.wsPath ?? this.wsPath;
    this.publicPath = settings.publicPath;
    this.clientPath = settings.clientPath;
    this.outputPath = settings.outputPath;

    ensureDirSync(this.publicPath);

    this.url = `http://localhost:${this.port}`;
    this.fastify = fastify({ logger: this.dev });

    this.fastify.register(wsPlugin);
    this.fastify.register(staticPlugin, {
      root: [this.publicPath, this.clientPath],
    });

    this.fastify.get(this.wsPath, { websocket: true }, (connection) =>
      this.websocketHandler(connection)
    );
  }

  broadcast(message: Message) {
    this.fastify.websocketServer.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(message));
      }
    });
  }

  async listen() {
    await this.fastify.listen(this.port);
    await watcher.subscribe(this.publicPath, (error, events) =>
      this.watcherHandler(error, events)
    );

    console.log(`Server listening at ${this.url}`);

    if (!this.dev) {
      open(this.url);
    }
  }

  websocketHandler(connection: SocketStream) {
    console.log("websocketHandler", this.url, connection);
  }

  watcherHandler(error: Error | null, events: watcher.Event[]) {
    if (error) {
      this.fastify.log.error(`WatcherHandler: ${error}`);
      return;
    }

    events.forEach((event) => {
      if (path.resolve(event.path) === this.outputPath) {
        console.log("QR event:", event.type);
      }
    });
  }
}

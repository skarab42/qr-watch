import path from "path";
import open from "open";
import chokidar from "chokidar";
import { ensureDirSync } from "fs-extra";
import staticPlugin from "fastify-static";
import fastify, { FastifyInstance } from "fastify";
import wsPlugin, { SocketStream } from "fastify-websocket";

import type { Message } from "@qr-watch/types";
import EventEmitter from "events";

export interface Settings {
  dev?: boolean;
  port?: number;
  wsPath?: string;
  publicPath: string;
  clientPath: string;
  outputPath: string;
}

type EventName =
  | "ws:client:connection"
  | "ws:client:message"
  | "qr:watch:create"
  | "qr:watch:change"
  | "qr:watch:unlink";

export default class Server {
  readonly dev: boolean = false;
  readonly port: number = 3000;
  readonly wsPath: string = "/ws";
  readonly publicPath: string;
  readonly clientPath: string;
  readonly outputPath: string;

  readonly url: string;
  readonly ee: EventEmitter;
  readonly fastify: FastifyInstance;

  constructor(settings: Settings) {
    this.dev = settings.dev ?? this.dev;
    this.port = settings.port ?? this.port;
    this.wsPath = settings.wsPath ?? this.wsPath;
    this.publicPath = settings.publicPath;
    this.clientPath = settings.clientPath;
    this.outputPath = settings.outputPath;

    ensureDirSync(this.publicPath);

    this.ee = new EventEmitter();
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

  // TODO How to type listeners ?
  on(event: EventName, listener: (...args: any[]) => void) {
    this.ee.on(event, listener);
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
    chokidar
      .watch(this.publicPath)
      .on("all", (event, path) => this.watcherHandler(event, path));

    console.log(`Server listening at ${this.url}`);

    if (!this.dev) {
      open(this.url);
    }
  }

  websocketHandler(connection: SocketStream) {
    this.ee.emit("ws:client:connection", connection);

    connection.socket.on("message", async (data) => {
      try {
        const message: Message = JSON.parse(data.toString());
        this.ee.emit("ws:client:message", message);
      } catch (error) {
        this.fastify.log.error(`WebsocketHandler: ${error}`);
      }
    });
  }

  watcherHandler(event: string, filePath: string) {
    if (path.resolve(filePath) === this.outputPath) {
      this.ee.emit(`qr:watch:${event}`);
    }
  }
}

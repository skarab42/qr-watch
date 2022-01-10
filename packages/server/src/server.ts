import open from "open";
import fsStatic from "fastify-static";
import { ensureDirSync } from "fs-extra";
import type { Message } from "@qr-watch/types";
import fastify, { FastifyInstance } from "fastify";
import watcher, { SubscribeCallback } from "@parcel/watcher";
import fsWebsocket, { WebsocketHandler } from "fastify-websocket";

export type WatcherHandler = SubscribeCallback;
export type { WebsocketHandler } from "fastify-websocket";

interface Settings {
  dev?: boolean;
  port: number;
  publicPath: string;
  clientPath: string;
  watcherHandler: WatcherHandler;
  websocketHandler: WebsocketHandler;
}

export default function server(settings: Settings) {
  const server = create(settings);

  return {
    server,
    settings,
    listen: () => listen(server, settings),
    broadcast: (message: Message) => broadcast(server, message),
  };
}

function create(settings: Settings): FastifyInstance {
  const server = fastify({ logger: settings.dev });

  ensureDirSync(settings.publicPath);

  server.register(fsWebsocket);
  server.register(fsStatic, {
    root: [settings.publicPath, settings.clientPath],
  });
  server.get("/ws", { websocket: true }, settings.websocketHandler);

  return server;
}

async function listen(server: FastifyInstance, settings: Settings) {
  await watcher.subscribe(settings.publicPath, settings.watcherHandler);
  await server.listen(settings.port);

  const url = `http://localhost:${settings.port}`;

  console.log(`Server listening at ${url}`);

  if (!settings.dev) {
    open(url);
  }
}

function broadcast(server: FastifyInstance, message: Message) {
  server.websocketServer.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
}

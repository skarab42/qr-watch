import open from "open";
import fsStatic from "fastify-static";
import { ensureDirSync } from "fs-extra";
import fastify, { FastifyInstance } from "fastify";
import fsWebsocket, { SocketStream, WebsocketHandler } from "fastify-websocket";

export type Connection = SocketStream;

interface Settings {
  dev?: boolean;
  port: number;
  publicPath: string;
  clientPath: string;
  websocketHandler: WebsocketHandler;
}

export default function server(settings: Settings) {
  const server = create(settings);

  return {
    server,
    settings,
    listen: () => listen(server, settings),
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
  await server.listen(settings.port);

  const url = `http://localhost:${settings.port}`;

  console.log(`Server listening at ${url}`);

  if (!settings.dev) {
    open(url);
  }
}

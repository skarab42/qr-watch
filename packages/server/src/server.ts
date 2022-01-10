import open from "open";
import fsStatic from "fastify-static";
import fastify, { FastifyInstance } from "fastify";
import fsWebsocket, { SocketStream, WebsocketHandler } from "fastify-websocket";

export type Connection = SocketStream;

interface Settings {
  dev?: boolean;
  port: number;
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

  server.register(fsWebsocket);
  server.register(fsStatic, { root: settings.clientPath });
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

import config from "./config";
import Server from "./server";

import type { Message } from "@qr-watch/types";

const server = new Server(config);

server.on("ws:client:connection", () => {
  console.log("ws:client:connection");
});

server.on("ws:client:message", (message: Message) => {
  console.log("ws:client:message", message);
});

server.on("qr:watch:create", () => {
  console.log("qr:watch:create");
});

server.on("qr:watch:update", () => {
  console.log("qr:watch:update");
});

server.on("qr:watch:delete", () => {
  console.log("qr:watch:delete");
});

server.listen();

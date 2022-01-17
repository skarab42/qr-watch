import config from "./config";
import Server from "./server";
import qr from "./qr-code";

import type { Message } from "@qr-watch/types";

const server = new Server(config);

server.on("ws:client:message", (message: Message) => {
  switch (message.type) {
    case "get-code":
      const code = qr.getCode(config.outputPath);
      server.broadcast({
        type: "get-code",
        data: code ? JSON.stringify(code) : undefined,
      });
      break;
    case "new-code":
      if (message.data) {
        qr.newCode(message.data);
      }
      break;
  }
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

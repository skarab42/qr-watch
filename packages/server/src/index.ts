import config from "./config";
import Server from "./server";
import qr from "./qr-code";

import type { Message } from "@qr-watch/types";

const server = new Server(config);

server.on("ws:client:message", async (message: Message) => {
  switch (message.type) {
    case "get-code":
      const { file, code } = qr.getCode(config.outputPath);
      server.broadcast({ type: "get-code", file, code });
      break;
    case "new-code":
      if (message.code) {
        const { file, code } = await qr.newCode(
          config.outputPath,
          message.code
        );
        server.broadcast({ type: "new-code", file, code });
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

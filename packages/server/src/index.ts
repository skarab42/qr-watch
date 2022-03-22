import config from "./config";
import Server from "./server";
import qr from "./qr-code";
import open from "open";

import type { Message } from "@qr-watch/types";

const server = new Server(config);

let currentCode: string | null = null;

server.on("ws:client:message", async (message: Message) => {
  switch (message.type) {
    case "get-code":
      const { file, code } = qr.getCode(config.outputPath);
      server.broadcast({ type: "get-code", file, code });
      currentCode = code;
      await checkCode();
      break;
    case "new-code":
      if (message.code) {
        const { file, code } = await qr.newCode(
          config.outputPath,
          message.code
        );
        currentCode = code;
        server.broadcast({ type: "new-code", file, code });
      }
      break;
    case "remove-code":
      currentCode = null;
      qr.removeCode(config.outputPath);
      server.broadcast({ type: "remove-code" });
      break;
    case "open-public-dir":
      open(config.publicPath);
      break;
  }
});

async function checkCode() {
  if (currentCode) {
    const isValid = await qr.checkCode(config.outputPath, currentCode);
    server.broadcast({ type: "check-code", isValid });
  }
}

// server.on("qr:watch:create", () => {
//   console.log("qr:watch:create");
// });

server.on("qr:watch:change", checkCode);

server.on("qr:watch:unlink", () => {
  server.broadcast({ type: "remove-code" });
});

server.listen();

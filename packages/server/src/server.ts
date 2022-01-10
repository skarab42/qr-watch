import path from "path";
import open from "open";
import jsqr from "jsqr";
import fastify from "fastify";
import ws from "fastify-websocket";
import assets from "fastify-static";
import imageData from "get-image-data";
import qrcode, { QRCodeToFileOptions } from "qrcode";
import {
  ensureDirSync,
  pathExistsSync,
  readJsonSync,
  writeJsonSync,
} from "fs-extra";
import watcher, { SubscribeCallback } from "@parcel/watcher";

import type { Message } from "@qr-watch/types";

const port = 8080;
const outputDir = path.resolve(process.cwd(), "output");
const outputFile = path.resolve(outputDir, "qr.png");
const qrOptions: QRCodeToFileOptions = {
  type: "png",
  errorCorrectionLevel: "H",
  //width: 400,
  version: 40,
  color: {
    light: "#ffffff00",
  },
};

ensureDirSync(outputDir);

let qrString = "";
const server = fastify({ logger: true });

server.register(ws);

server.register(assets, {
  root: path.join(__dirname, "../../client/dist"),
  prefix: "/",
});

server.get("/ws", { websocket: true }, (connection) => {
  connection.socket.on("message", async (data) => {
    try {
      const message: Message = JSON.parse(data.toString());
      console.log(message);

      if (message.type === "init") {
        if (pathExistsSync(outputFile)) {
          const { data } = readJsonSync(`${outputFile}.json`);
          qrString = data;
          console.log(data);

          broadcast({ type: "load-image", data: outputFile });
        } else {
          broadcast({ type: "show-form" });
        }
      } else if (message.type === "create-qrcode") {
        if (typeof message.data === "string") {
          qrString = message.data;
          await qrcode.toFile(outputFile, qrString, qrOptions);
          writeJsonSync(`${outputFile}.json`, { data: qrString });
          broadcast({ type: "load-image", data: outputFile });
          open(outputDir);
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
});

function broadcast(message: Message) {
  server.websocketServer.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
}

const watcherHandler: SubscribeCallback = (err, events) => {
  const [event] = events;

  if (err) {
    console.log(">>>>", err);
    return;
  }

  if (!event) {
    console.log("No event found....");
    return;
  }

  if (event.type === "update") {
    console.log("update ...");
    broadcast({ type: "update-image" });
    imageData(event.path, (err, info) => {
      const code = jsqr(info.data, info.width, info.height);

      console.log({ code });

      if (code && !err && code.data === qrString) {
        console.log("Found:", code.data);
        broadcast({ type: "qr-status", data: "ok" });
      } else {
        broadcast({ type: "qr-status", data: "ko" });
      }
    });
  }

  return;
};

const start = async () => {
  try {
    await watcher.subscribe(outputDir, watcherHandler);
    await server.listen(port);
    // open(`http://localhost:${port}`);
  } catch (err) {
    server.log.error(`Start Error: ${err}`);
    process.exit(1);
  }
};

start();

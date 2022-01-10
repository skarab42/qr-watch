import path from "path";
import server, { WatcherHandler, WebsocketHandler } from "./server";

const outputDir = path.resolve(process.cwd(), "output");

const watcherHandler: WatcherHandler = (err, events) => {
  console.log("Watch:", err, events);
};

const websocketHandler: WebsocketHandler = (connection) => {
  console.log("New connection:", connection);
};

const app = server({
  port: 8080,
  publicPath: outputDir,
  clientPath: path.join(__dirname, "../../client/dist"),
  // @ts-expect-error noPropertyAccessFromIndexSignature
  dev: process.env.NODE_ENV === "dev",
  websocketHandler,
  watcherHandler,
});

app.listen();

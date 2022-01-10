import path from "path";
import config from "./config";
import server, { WatcherHandler, WebsocketHandler } from "./server";

const watcherHandler: WatcherHandler = (error, events) => {
  if (error) {
    app.server.log.error(`WatcherHandler: ${error}`);
    return;
  }

  events.forEach((event) => {
    if (path.resolve(event.path) === config.outputPath) {
      console.log("QR event:", event.type);
    }
  });
};

const websocketHandler: WebsocketHandler = (connection) => {
  console.log("New connection:", connection);
};

const app = server({
  ...config,
  websocketHandler,
  watcherHandler,
});

app.listen();

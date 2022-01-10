import config from "./config";
import server, { WatcherHandler, WebsocketHandler } from "./server";

const watcherHandler: WatcherHandler = (err, events) => {
  console.log("Watch:", err, events);
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

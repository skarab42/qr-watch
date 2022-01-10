import path from "path";
import server, { Connection } from "./server";

const app = server({
  port: 8080,
  clientPath: path.join(__dirname, "../../client/dist"),
  // @ts-expect-error noPropertyAccessFromIndexSignature
  dev: process.env.NODE_ENV === "dev",
  websocketHandler,
});

function websocketHandler(connection: Connection) {
  console.log("New connection:", connection);
}

app.listen();

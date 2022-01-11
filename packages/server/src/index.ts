import config from "./config";
import Server from "./server";

const server = new Server(config);

server.listen();

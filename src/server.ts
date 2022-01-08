import path from "path";
import fastify from "fastify";
import ws from "fastify-websocket";
import assets from "fastify-static";

const server = fastify({ logger: true });

server.register(ws);

server.register(assets, {
  root: path.join(__dirname, "../public"),
  prefix: "/",
});

server.get("/ws", { websocket: true }, (connection) => {
  connection.socket.on("message", (message) => {
    console.log(message.toString());

    connection.socket.send("hi from server");
  });
});

const start = async () => {
  try {
    await server.listen(3000);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();

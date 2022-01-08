"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const fastify_1 = (0, tslib_1.__importDefault)(require("fastify"));
const fastify_websocket_1 = (0, tslib_1.__importDefault)(require("fastify-websocket"));
const fastify_static_1 = (0, tslib_1.__importDefault)(require("fastify-static"));
const server = (0, fastify_1.default)({ logger: true });
server.register(fastify_websocket_1.default);
server.register(fastify_static_1.default, {
    root: path_1.default.join(__dirname, "../public"),
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
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=server.js.map
import type { Message } from "@qr-watch/types";
import EventEmitter from "events";

type WebSocketListener = (this: WebSocket, event: Event | Message) => void;

export default class WS extends WebSocket {
  readonly ee: EventEmitter;

  constructor(url: string | URL, protocols?: string | string[]) {
    super(url, protocols);

    this.ee = new EventEmitter();

    this.addEventListener("open", (event) => this.ee.emit("open", event));
    this.addEventListener("close", (event) => this.ee.emit("close", event));
    this.addEventListener("error", (event) => this.ee.emit("error", event));
    this.addEventListener("message", (event) =>
      this.ee.emit("message", JSON.parse(event.data))
    );
  }

  emit(message: string | Message) {
    this.send(typeof message === "string" ? message : JSON.stringify(message));
  }

  on(type: string, listener: WebSocketListener) {
    this.ee.on(type, listener);
  }
}

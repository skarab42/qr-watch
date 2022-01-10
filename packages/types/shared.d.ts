export type MessageType =
  | "init"
  | "show-form"
  | "create-qrcode"
  | "load-image"
  | "update-image"
  | "qr-status";

export interface Message {
  type: MessageType;
  data?: string;
}

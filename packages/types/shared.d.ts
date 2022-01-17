export type MessageType = "get-code" | "new-code";
// | "init"
// | "show-form"
// | "create-qrcode"
// | "load-image"
// | "update-image"
// | "qr-status";

export interface Message {
  type: MessageType;
  file?: string | null;
  code?: string | null;
}

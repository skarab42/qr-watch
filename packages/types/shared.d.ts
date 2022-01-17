export type MessageType = "get-code" | "new-code" | "remove-code";

export interface Message {
  type: MessageType;
  file?: string | null;
  code?: string | null;
}

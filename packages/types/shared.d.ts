export type MessageType =
  | "get-code"
  | "new-code"
  | "remove-code"
  | "check-code"
  | "open-public-dir";

export interface Message {
  type: MessageType;
  file?: string | null;
  code?: string | null;
  isValid?: boolean;
}

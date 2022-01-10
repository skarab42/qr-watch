import os from "os";
import path from "path";

export default {
  port: 8080,
  publicPath: path.resolve(os.homedir(), "qr-watch"),
  clientPath: path.join(__dirname, "../../client/dist"),
  // @ts-expect-error noPropertyAccessFromIndexSignature
  dev: process.env.NODE_ENV === "dev",
};

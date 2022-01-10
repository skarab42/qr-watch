import os from "os";
import path from "path";

const port = 8080;

const clientPath = path.join(__dirname, "../../client/dist");
const publicPath = path.resolve(os.homedir(), "qr-watch");
const outputPath = path.resolve(publicPath, "qr.png");

// @ts-expect-error noPropertyAccessFromIndexSignature
const dev = process.env.NODE_ENV === "dev";

export default {
  dev,
  port,
  clientPath,
  publicPath,
  outputPath,
};

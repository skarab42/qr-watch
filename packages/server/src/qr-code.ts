import {
  pathExistsSync,
  readJsonSync,
  removeSync,
  writeJsonSync,
} from "fs-extra";
import qrcode, { QRCodeToFileOptions } from "qrcode";
import { basename } from "path";

const defaults: QRCodeToFileOptions = {
  errorCorrectionLevel: "H",
  type: "png",
  color: {
    light: "#ffffff00",
  },
};

function response(path: string, code: string) {
  return { file: basename(path), code };
}

export function getCode(path: string) {
  const jsonPath = `${path}.json`;

  if (pathExistsSync(path) && pathExistsSync(jsonPath)) {
    const { code } = readJsonSync(jsonPath);

    return response(path, code);
  }

  return { file: null, code: null };
}

export async function newCode(path: string, code: string) {
  await qrcode.toFile(path, code, defaults);

  const res = response(path, code);

  writeJsonSync(`${path}.json`, res);

  return res;
}

export function removeCode(path: string) {
  removeSync(`${path}.json`);
  removeSync(path);
}

export default {
  getCode,
  newCode,
  removeCode,
};

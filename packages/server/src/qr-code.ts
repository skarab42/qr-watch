import {
  pathExistsSync,
  readJsonSync,
  removeSync,
  writeJsonSync,
} from "fs-extra";
import jsqr from "jsqr";
import { basename } from "path";
import imageData from "get-image-data";
import qrcode, { QRCodeToFileOptions } from "qrcode";

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

export function checkCode(path: string, code: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    imageData(path, (err, info) => {
      if (err) {
        reject(err);
        return;
      }

      const res = jsqr(info.data, info.width, info.height);

      resolve(!!(res && res.data === code));
    });
  });
}

export default {
  getCode,
  newCode,
  removeCode,
  checkCode,
};

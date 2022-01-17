import { pathExistsSync, readJsonSync } from "fs-extra";
import { basename } from "path";

export function getCode(path: string) {
  const jsonPath = `${path}.json`;

  if (pathExistsSync(path) && pathExistsSync(jsonPath)) {
    const { data } = readJsonSync(jsonPath);

    return { path, filename: basename(path), data };
  }

  return null;
}

export function newCode(data: string) {
  console.log("create new code with text:", data);
}

export default {
  getCode,
  newCode,
};

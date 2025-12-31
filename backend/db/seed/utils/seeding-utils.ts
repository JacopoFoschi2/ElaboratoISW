import fs from "fs";
import path from "path";

export function readImage(basePath: string, folder: string, fileName: string) {
  return fs.readFileSync(path.join(basePath, folder, fileName));
}
import fs from "fs";
import path from "path";

export function readImage(basePath: string, fileName: string) {
  return fs.readFileSync(path.join(basePath, fileName));
}

export function getBaseAssetsPath(assetsFolder: string): string {
  return path.resolve(process.cwd(), assetsFolder);
}
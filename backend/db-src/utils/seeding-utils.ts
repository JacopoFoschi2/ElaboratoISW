import fs from "fs";
import { Connection } from "mysql2";
import path from "path";

export function readImage(basePath: string, folder: string, fileName: string) {
  return fs.readFileSync(path.join(basePath, folder, fileName));
}

export function readFile(filePath: string) {
  const resolvedPath = path.resolve(process.cwd(), filePath);
  return fs.readFileSync(resolvedPath, "utf-8");
}

export function readJson(jsonPath: string) {
  return JSON.parse(readFile(jsonPath));
}

export function getBaseAssetsPath(assetsFolder: string): string {
  return path.resolve(process.cwd(), assetsFolder);
}

export function insertRecord(connection: Connection, params: any[], query: string): Promise<void> {
  return new Promise((resolve, reject) => {
    connection.execute(
      query,
      params,
      function (err: any) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

export async function seedData(
  datas: any[], 
  insertFunction: (data: any) => Promise<void>, 
  connection: Connection, 
  errorMessage: string,
  seedingCompleteMessage: string
) {
  try {
    for (const data of datas) {
      await insertFunction(data);
    }
  } catch (error) {
    console.error(errorMessage, error);
  } finally {
    console.log(seedingCompleteMessage);
    connection.end();
  }
}
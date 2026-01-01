import fs from "fs";
import { Connection } from "mysql2";
import path from "path";

export function readImage(basePath: string, folder: string, fileName: string) {
  return fs.readFileSync(path.join(basePath, folder, fileName));
}

export function readJson(jsonPath: string) {
  const resolvedJsonPath = path.resolve(process.cwd(), jsonPath);
  const content = fs.readFileSync(resolvedJsonPath, "utf-8");
  return JSON.parse(content);;
}

export function getBaseAssetsPath(assetsFolder: string): string {
  return path.resolve(process.cwd(), assetsFolder);
}

function insertRecord(connection: Connection, params: any[], query: string): Promise<void> {
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
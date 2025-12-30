import fs from "fs";
import path from "path";
import { connection } from "../../src/utils/db-connection";

function readImage(basePath: string, folder: string, fileName: string) {
  return fs.readFileSync(path.join(basePath, folder, fileName));
}

type Game = {
    imagesName: string;
    gameName: string;
    gameDesc: string;
    gameReleaseDate: string;
    gameSteamLink: string | null;
    gameGoGLink: string | null;
    gameEpicLink: string | null;
}
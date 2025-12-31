import fs from "fs";
import path from "path";
import { Game } from "../types/game";
import { readImage } from "../utils/seeding-utils";
import { connection } from "../utils/connection";

function insertGame(game: Game): Promise<void> {
  return new Promise((resolve, reject) => {
    const coverBin = readImage(assetsPath, covers, game.imagesName);
    const smallBannerBin = readImage(assetsPath, smallBanners, game.imagesName);
    const bigBannerBin = readImage(assetsPath, bigBanners, game.imagesName);
    const params = [
      game.gameName,
      game.gameDesc,
      game.gameSteamLink,
      game.gameGoGLink,
      game.gameEpicLink,
      game.gameReleaseDate,
      game.imagesName,
      smallBannerBin,
      game.imagesName,
      coverBin,
      game.imagesName,
      bigBannerBin,
    ];
    connection.execute(
      query,
      params,
      function (err: any, results: any, fields: any) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

const jsonPath = path.resolve(__dirname, "../games.json");
const content = fs.readFileSync(jsonPath, "utf-8");
const games: Game[] = JSON.parse(content);

const covers = "covers";
const bigBanners = "bigBanners";
const smallBanners = "smallBanners";
const assetsPath = path.resolve(process.cwd(), "db/assets");

const query = `
    INSERT INTO games (
        gameName,
        gameDesc,
        gameSteamLink,
        gameGoGLink,
        gameEpicLink,
        gameReleaseDate,
        gameSmallBannerName,
        gameSmallBannerBin,
        gameCoverName,
        gameCoverBin,
        gameBigBannerName,
        gameBigBannerBin
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

export async function seedGames() {
  try {
    for (const game of games) {
      await insertGame(game);
      console.log(`Inserted game: ${game.gameName}`);
    }
  } catch (error) {
    console.error("Error seeding games:", error);
  } finally {
    console.log("Seeding completed.");
    connection.end();
  }
}
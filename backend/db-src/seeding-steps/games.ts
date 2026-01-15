import { Connection } from "mysql2";
import { Game } from "../types/game";
import {
  getBaseAssetsPath,
  insertRecord,
  readImage,
  readJson,
  seedData,
} from "../utils/seeding-utils";

const games: Game[] = readJson("db-src/data/games.json");

const covers = "covers";
const bigBanners = "bigBanners";
const smallBanners = "smallBanners";
const assetsPath = getBaseAssetsPath("db-src/assets");

const query = `
  INSERT INTO games (
      gameName,
      gameAlternateName,
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
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

function insertGame(game: Game, connection: Connection): Promise<void> {
  const coverBin = readImage(assetsPath, covers, game.imagesName);
  const smallBannerBin = readImage(assetsPath, smallBanners, game.imagesName);
  const bigBannerBin = readImage(assetsPath, bigBanners, game.imagesName);
  const params = [
    game.gameName,
    game.gameAlternateName,
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
  return insertRecord(connection, params, query);
}

export async function seedGames(connection: Connection) {
  await seedData(
    games,
    insertGame,
    connection,
    "Error seeding games:",
    "Games seeding completed."
  );
}
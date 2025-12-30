import fs from "fs";
import path from "path";
import mysql, { Connection } from "mysql2";

const connection: Connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'TODO_DB_NAME'
})

type Game = {
  imagesName: string;
  gameName: string;
  gameDesc: string;
  gameReleaseDate: string;
  gameSteamLink: string | null;
  gameGoGLink: string | null;
  gameEpicLink: string | null;
};

function readImage(basePath: string, folder: string, fileName: string) {
  return fs.readFileSync(path.join(basePath, folder, fileName));
}

const jsonPath = path.resolve(__dirname, "games.json");
const content = fs.readFileSync(jsonPath, "utf-8");
const games: Game[] = JSON.parse(content);

const covers = "covers";
const bigBanners = "bigBanners";
const smallBanners = "smallBanners";
const assetsPath = path.resolve(__dirname, "assets");

const values: string[] = [];
const params: any[] = [];
const baseQuery = `
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
    VALUES 
    `;

for (const game of games) {
  const coverBin = readImage(assetsPath, covers, game.imagesName);
  const smallBannerBin = readImage(assetsPath, smallBanners, game.imagesName);
  const bigBannerBin = readImage(assetsPath, bigBanners, game.imagesName);
  values.push("(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
  params.push(
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
    bigBannerBin
  );
}

const finalQuery = baseQuery + values.join(",\n");
connection.execute(
  finalQuery,
  params,
  function (err: any, results: any, fields: any) {
    if (err) {
      console.error("Error seeding database:", err);
      return;
    } else {
      console.log("Database seeded successfully.");
    }
    connection.end();
  }
);
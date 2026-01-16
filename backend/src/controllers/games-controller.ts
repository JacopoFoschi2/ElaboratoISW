import type { Request, Response } from "express";
import { connection } from "../utils/db-connection";
import { handleUser } from "../utils/auth";

export const createGame = async (req: Request, res: Response) => {
  const user = await handleUser(req, res, ["master"]);
  if (!user) {
    return;
  }

  await connection.execute(
    `INSERT INTO games (gameName, gameDesc, gameSteamLink,
     gameEpicLink, gameGoGLink, gameReleaseDate, gameSmallBannerName, 
     gameSmallBannerBin, gameCoverName, gameCoverBin, gameBigBannerName, gameBigBannerBin) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      req.body["gameName"],
      req.body["gameDesc"],
      req.body["gameSteamLink"],
      req.body["gameEpicLink"],
      req.body["gameGoGLink"],
      req.body["gameReleaseDate"],
      req.body["gameSmallBannerName"],
      req.body["gameSmallBannerBin"],
      req.body["gameCoverName"],
      req.body["gameCoverBin"],
      req.body["gameBigBannerName"],
      req.body["gameBigBannerBin"],
    ]
  );
  res.status(201).send("Game created successfully");
};

export const listGamesOfGenre = async (req: Request, res: Response) => {
  const [games] = await connection.execute(
    `SELECT c.gameId, gameName, gameCoverBin, gameCoverName FROM games as g
         JOIN game_categories as c ON g.gameId = c.gameId
         WHERE c.categoryId = ?`,
    [req.params["genreId"]]
  );
  res.status(200).json(games);
};

export const listGamesOrderedByRating = async (req: Request, res: Response) => {
  const [games] = await connection.execute(
    `SELECT gameId, gameName, gameCoverBin, gameCoverName FROM games
         ORDER BY (SELECT AVG(reviewRating) FROM reviews WHERE reviews.gameId = games.gameId) DESC`,
    []
  );
  res.status(200).json(games);
};

export const listGamesOrderedByRelease = async (
  req: Request,
  res: Response
) => {
  const [games] = await connection.execute(
    `SELECT gameId, gameName, gameCoverBin, gameCoverName FROM games
         ORDER BY gameReleaseDate DESC`,
    []
  );
  res.status(200).json(games);
};

export const listGamesAsYouType = async (req: Request, res: Response) => {
  const [games] = await connection.execute(
    `SELECT gameId, gameName, gameSmallBannerBin, gameSmallBannerName
        FROM games
        WHERE gameName LIKE CONCAT('%', ?, '%') or 
        gameAlternateName like CONCAT('%', ?, '%')
        ORDER BY gameName DESC
        LIMIT 4`,
    [req.params["partialName"], req.params["partialName"]]
  );
  res.status(200).json(games);
};

export const listGamesMatching = async (req: Request, res: Response) => {
  const [games] = await connection.execute(
    `SELECT gameId, gameName, gameCoverBin, gameCoverName
        FROM games
        WHERE gameName LIKE CONCAT('%', ?, '%') or 
        gameAlternateName like CONCAT('%', ?, '%')
        ORDER BY gameName DESC`,
    [req.params["partialName"], req.params["partialName"]]
  );
  res.status(200).json(games);
};

export const getGame = async (req: Request, res: Response) => {
  const [game] = await connection.execute(
    `SELECT gameName, gameDesc, gameSteamLink, gameGoGLink, gameEpicLink, 
    gameReleaseDate, gameCoverBin, gameCoverName, gameRating FROM games_with_rating WHERE gameId = ?`,
    [req.params["gameId"]]
  );
  res.status(200).json(game);
};

export const updateGame = async (req: Request, res: Response) => {
  const user = await handleUser(req, res, ["master"]);
  if (!user) {
    return;
  }

  await connection.execute(
    `UPDATE games SET gameName = ?, gameDesc = ?, gameSteamLink = ?, 
    gameEpicLink = ?, gameGoGLink = ?, gameReleaseDate = ?, gameSmallBannerName = ?, 
    gameSmallBannerBin = ?, gameCoverName = ?, gameCoverBin = ?, gameBigBannerName = ?, gameBigBannerBin = ? 
    WHERE gameId = ?`,
    [
      req.body["gameName"],
      req.body["gameDesc"],
      req.body["gameSteamLink"],
      req.body["gameEpicLink"],
      req.body["gameGoGLink"],
      req.body["gameReleaseDate"],
      req.body["gameSmallBannerName"],
      req.body["gameSmallBannerBin"],
      req.body["gameCoverName"],
      req.body["gameCoverBin"],
      req.body["gameBigBannerName"],
      req.body["gameBigBannerBin"],
      req.params["gameId"],
    ]
  );
  res.status(200).send("Game updated successfully");
};

export const deleteGame = async (req: Request, res: Response) => {
  const user = await handleUser(req, res, ["master"]);
  if (!user) {
    return;
  }

  await connection.execute(`DELETE FROM games WHERE gameId = ?`, [
    req.params["gameId"],
  ]);
  res.status(200).send("Game deleted successfully");
};

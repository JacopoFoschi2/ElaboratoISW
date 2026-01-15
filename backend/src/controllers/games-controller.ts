import type { Request, Response } from "express"
import { connection } from "../utils/db-connection"
import { handleQueryOutput } from "../utils/query-handling"

export async function createGame(req: Request, res: Response) {
    connection.execute(
        `INSERT INTO games (gameName, gameDesc, gameSteamLink, gameEpicLink, gameGoGLink, gameReleaseDate, gameSmallBannerName, gameSmallBannerBin, gameCoverName, gameCoverBin, gameBigBannerName, gameBigBannerBin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.body["gameName"], req.body["gameDesc"], req.body["gameSteamLink"], req.body["gameEpicLink"], req.body["gameGoGLink"], req.body["gameReleaseDate"], req.body["gameSmallBannerName"], req.body["gameSmallBannerBin"], req.body["gameCoverName"], req.body["gameCoverBin"], req.body["gameBigBannerName"], req.body["gameBigBannerBin"]],
        handleQueryOutput(201, res)
    )
};

export async function listGamesOfGenre(req: Request, res: Response) {
    connection.execute(
        `SELECT c.gameId, gameName, gameCoverBin, gameCoverName FROM games as g
         JOIN game_categories as c ON g.gameId = c.gameId
         WHERE c.categoryId = ?`,
        [req.params["genreId"]],
        handleQueryOutput(200, res)
    )
};

export async function listGamesOrderedByRating(req: Request, res: Response) {
    connection.execute(
        `SELECT gameId, gameName, gameCoverBin, gameCoverName FROM games
         ORDER BY (SELECT AVG(reviewRating) FROM reviews WHERE reviews.gameId = games.gameId) DESC`,
        [],
        handleQueryOutput(200, res)
    )
};

export async function listGamesOrderedByRelease(req: Request, res: Response) {
    connection.execute(
        `SELECT gameId, gameName, gameCoverBin, gameCoverName FROM games
         ORDER BY gameReleaseDate DESC`,
        [],
        handleQueryOutput(200, res)
    )
};

export async function getGame(req: Request, res: Response) {
    connection.execute(
        `SELECT gameName, gameDesc, gameSteamLink, gameGoGLink, gameEpicLink, gameReleaseDate, gameCoverBin, gameCoverName  FROM games WHERE gameId = ?`,
        [req.params["gameId"]],
        handleQueryOutput(200, res)
    )
};

export async function updateGame(req: Request, res: Response) {
    connection.execute(
        `UPDATE games SET gameName = ?, gameDesc = ?, gameSteamLink = ?, gameEpicLink = ?, gameGoGLink = ?, gameReleaseDate = ?, gameSmallBannerName = ?, gameSmallBannerBin = ?, gameCoverName = ?, gameCoverBin = ?, gameBigBannerName = ?, gameBigBannerBin = ? WHERE gameId = ?`,
        [req.body["gameName"], req.body["gameDesc"], req.body["gameSteamLink"], req.body["gameEpicLink"], req.body["gameGoGLink"], req.body["gameReleaseDate"], req.body["gameSmallBannerName"], req.body["gameSmallBannerBin"], req.body["gameCoverName"], req.body["gameCoverBin"], req.body["gameBigBannerName"], req.body["gameBigBannerBin"], req.params["gameId"]],
        handleQueryOutput(200, res)
    )
};

export async function deleteGame(req: Request, res: Response) {
    connection.execute(
        `DELETE FROM games WHERE gameId = ?`,
        [req.params["gameId"]],
        handleQueryOutput(200, res)
    )
};
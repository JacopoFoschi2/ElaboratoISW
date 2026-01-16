import type { Request, Response } from "express"
import { connection } from "../utils/db-connection"
import { handleQueryOutput } from "../utils/query-handling"

export const addComment = async (req: Request, res: Response) => {
    await connection.execute(
        `INSERT INTO comments (gameId, userId, commentBody, commentTimeStamp) VALUES (?, ?, ?, NOW())`,
        [req.body["gameId"], req.body["userId"], req.body["commentBody"]],
        handleQueryOutput(201, res)
    )
};

export const listForums = async (req: Request, res: Response) => {
    await connection.execute(
        `SELECT gameId, gameName, gameSmallBannerName, gameSmallBannerBin FROM games`,
        [],
        handleQueryOutput(200, res)
    )
};

export const listForumsAsYouType = async (req: Request, res: Response) => {
    await connection.execute(
        `SELECT gameId, gameName, gameSmallBannerBin, gameSmallBannerName
        FROM games
        WHERE gameName LIKE CONCAT('%', ?, '%') or 
        gameAlternateName like CONCAT('%', ?, '%')
        ORDER BY gameName DESC
        LIMIT 15`,
        [req.params["partialName"], req.params["partialName"]],
        handleQueryOutput(200, res)
    )
};

export const listForumsMatching = async (req: Request, res: Response) => {
    await connection.execute(
        `SELECT gameId, gameName, gameSmallBannerBin, gameSmallBannerName
        FROM games
        WHERE gameName LIKE CONCAT('%', ?, '%') or 
        gameAlternateName like CONCAT('%', ?, '%')
        ORDER BY gameName DESC`,
        [req.params["partialName"], req.params["partialName"]],
        handleQueryOutput(200, res)
    )
};

export const listCommentsOfGame = async (req: Request, res: Response) => {
    await connection.execute(
        `SELECT commentBody, commentTimeStamp, commentWasEdited, userUsername, userIconBin, userIconName 
        FROM comments as c join users as u ON c.userId = u.userId WHERE gameId = ? ORDER BY commentTimeStamp DESC`,
        [req.params['gameId']],
        handleQueryOutput(200, res)
    )
};

export const updateComment = async (req: Request, res: Response) => {
    await connection.execute(
        `INSERT INTO comments (commentBody, commentWasEdited) VALUES (?, true) WHERE commentId = ?`,
        [req.body["commentBody"], req.params["commentId"]],
        handleQueryOutput(200, res)
    )
};

export const deleteComment = async (req: Request, res: Response) => {
    await connection.execute(
        `DELETE FROM comments WHERE commentId = ?`,
        [req.params['commentId']],
        handleQueryOutput(200, res)
    )
};
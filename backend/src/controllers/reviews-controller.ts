import type { Request, Response } from "express"
import { connection } from "../utils/db-connection"
import { handleQueryOutput } from "../utils/query-handling"

export const createReview = async (req: Request, res: Response) => {
    await connection.execute(
        `INSERT INTO reviews (gameId, userId, reviewRating, reviewBody, reviewTimeStamp) VALUES (?, ?, ?, ?, NOW())`,
        [req.params["gameId"], req.params["userId"], req.body["reviewRating"], req.body["reviewBody"]],
        handleQueryOutput(201, res)
    )
};

export const listReviewsOfGame = async (req: Request, res: Response) => {
    await connection.execute(
        `SELECT * FROM reviews WHERE gameId = ? ORDER BY reviewTimeStamp DESC`,
        [req.params['gameId']],
        handleQueryOutput(200, res)
    )
};

export const listReviewsOfUser = async (req: Request, res: Response) => {
    await connection.execute(
        `SELECT * FROM reviews WHERE userId = ? ORDER BY reviewTimeStamp DESC`,
        [req.params['userId']],
        handleQueryOutput(200, res)
    )
};

export const updateReview = async (req: Request, res: Response) => {
    await connection.execute(
        `UPDATE reviews SET reviewRating = ?, reviewBody = ?, reviewTimeStamp = NOW(), reviewWasEdited = true WHERE gameId = ? AND userId = ?`,
        [req.body["reviewRating"], req.body["reviewBody"], req.params["gameId"], req.params["userId"]],
        handleQueryOutput(200, res)
    )
};

export const deleteReview = async (req: Request, res: Response) => {
    await connection.execute(
        `DELETE FROM reviews WHERE gameId = ? AND userId = ?`,
        [req.params["gameId"], req.params["userId"]],
        handleQueryOutput(200, res)
    )
};
import type { Request, Response } from "express"
import { connection } from "../utils/db-connection"
import { handleExists, handleQueryOutput } from "../utils/query-handling"

export const addToOwned = async (req: Request, res: Response) => {
    await connection.execute(
        `INSERT INTO owned (userId, gameId) VALUES (?, ?)`,
        [req.params["userId"], req.params["gameId"]],
        handleQueryOutput(201, res)
    )
};

export const listOwnedOfUser = async (req: Request, res: Response) => {
    await connection.execute(
        `SELECT gameId FROM owned WHERE userId = ?`,
        [req.params["userId"]],
        handleQueryOutput(200, res)
    )
};

export const deleteFromOwned = async (req: Request, res: Response) => {
    await connection.execute(
        `DELETE FROM owned WHERE userId = ? AND gameId = ?`,
        [req.params["userId"], req.params["gameId"]],
        handleQueryOutput(200, res)
    )
};

export const isOwned = async (req: Request, res: Response) => {
    await connection.execute(
        `SELECT * FROM owned WHERE userId = ? AND gameId = ?`,
        [req.params["userId"], req.params["gameId"]],
        handleExists(res)
    )
};
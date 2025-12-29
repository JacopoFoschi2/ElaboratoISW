import type { Request, Response } from "express"
import { connection } from "../utils/db-connection"
import { handleExists, handleQueryOutput } from "../utils/query-handling"

export async function addToOwned(req: Request, res: Response) {
    connection.execute(
        `INSERT INTO owned (userId, gameId) VALUES (?, ?)`,
        [req.params["userId"], req.params["gameId"]],
        handleQueryOutput(201, res)
    )
};

export async function listOwnedOfUser(req: Request, res: Response) {
    connection.execute(
        `SELECT gameId FROM owned WHERE userId = ?`,
        [req.params["userId"]],
        handleQueryOutput(200, res)
    )
};

export async function deleteFromOwned(req: Request, res: Response) {
    connection.execute(
        `DELETE FROM owned WHERE userId = ? AND gameId = ?`,
        [req.params["userId"], req.params["gameId"]],
        handleQueryOutput(200, res)
    )
};

export async function isOwned(req: Request, res: Response) {
    connection.execute(
        `SELECT * FROM owned WHERE userId = ? AND gameId = ?`,
        [req.params["userId"], req.params["gameId"]],
        handleExists(res)
    )
};
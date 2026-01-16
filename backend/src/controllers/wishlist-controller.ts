import type { Request, Response } from "express"
import { connection } from "../utils/db-connection"
import { handleExists, handleQueryOutput } from "../utils/query-handling"

export const addToWishlist = async (req: Request, res: Response) => {
    await connection.execute(
        `INSERT INTO wishlist (userId, gameId) VALUES (?, ?)`,
        [req.params["userId"], req.params["gameId"]],
        handleQueryOutput(201, res)
    )
};

export const listWishlistOfUser = async (req: Request, res: Response) => {
    await connection.execute(
        `SELECT gameId FROM wishlist WHERE userId = ?`,
        [req.params["userId"]],
        handleQueryOutput(200, res)
    )
};

export const deleteFromWishlist = async (req: Request, res: Response) => {
    await connection.execute(
        `DELETE FROM wishlist WHERE userId = ? AND gameId = ?`,
        [req.params["userId"], req.params["gameId"]],
        handleQueryOutput(200, res)
    )
};

export const isGameInWishlist = async (req: Request, res: Response) => {
    await connection.execute(
        `SELECT * FROM wishlist WHERE userId = ? AND gameId = ?`,
        [req.params["userId"], req.params["gameId"]],
        handleExists(res)
    )
};
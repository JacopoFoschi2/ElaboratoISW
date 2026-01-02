import type { Request, Response } from "express"
import { connection } from "../utils/db-connection"
import { handleExists, handleQueryOutput } from "../utils/query-handling"

export async function addToWishlist(req: Request, res: Response) {
    connection.execute(
        `INSERT INTO wishlist (userId, gameId) VALUES (?, ?)`,
        [req.params["userId"], req.params["gameId"]],
        handleQueryOutput(201, res)
    )
};

export async function listWishlistOfUser(req: Request, res: Response) {
    connection.execute(
        `SELECT gameId FROM wishlist WHERE userId = ?`,
        [req.params["userId"]],
        handleQueryOutput(200, res)
    )
};

export async function deleteFromWishlist(req: Request, res: Response) {
    connection.execute(
        `DELETE FROM wishlist WHERE userId = ? AND gameId = ?`,
        [req.params["userId"], req.params["gameId"]],
        handleQueryOutput(200, res)
    )
};

export async function isGameInWishlist(req: Request, res: Response) {
    connection.execute(
        `SELECT * FROM wishlist WHERE userId = ? AND gameId = ?`,
        [req.params["userId"], req.params["gameId"]],
        handleExists(res)
    )
};
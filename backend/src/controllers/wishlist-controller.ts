import type { Request, Response } from "express"
import { connection } from "../utils/db-connection"

export async function allWishlistOfUser(req: Request, res: Response) {
    connection.execute(
        ``,
        [req.params["id"]],
        function (err, results, fields) {
            res.json(results)
        }
    )
};

export async function isGameInWishlist(req: Request, res: Response) {
    connection.execute(
        ``,
        [req.params["id"]],
        function (err, results, fields) {
            res.json(results)
        }
    )
};

export async function addToWishlist(req: Request, res: Response) {
    connection.execute(
        ``,
        [req.params["id"]],
        function (err, results, fields) {
            res.json(results)
        }
    )
};

export async function removeFromWishlist(req: Request, res: Response) {
    connection.execute(
        ``,
        [req.params["id"]],
        function (err, results, fields) {
            res.json(results)
        }
    )
};
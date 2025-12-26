import type { Request, Response } from "express"
import { connection } from "../utils/db-connection"

export async function addToWishlist(req: Request, res: Response) {
    connection.execute(
        ``,
        [req.params["id"]],
        function (err, results, fields) {
            res.json(results)
        }
    )
};

export async function listWishlistOfUser(req: Request, res: Response) {
    connection.execute(
        ``,
        [req.params["id"]],
        function (err, results, fields) {
            res.json(results)
        }
    )
};

export async function deleteFromWishlist(req: Request, res: Response) {
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
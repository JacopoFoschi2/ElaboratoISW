import type { Request, Response } from "express"
import { connection } from "../utils/db-connection"

export async function allGamesOfGenre(req: Request, res: Response) {
    connection.execute(
        ``,
        [req.params["id"]],
        function (err, results, fields) {
            res.json(results)
        }
    )
};

export async function allGamesOrderedByRating(req: Request, res: Response) {
    connection.execute(
        ``,
        [],
        function (err, results, fields) {
            res.json(results)
        }
    )
};

export async function allGamesOrderedByRelease(req: Request, res: Response) {
    connection.execute(
        ``,
        [],
        function (err, results, fields) {
            res.json(results)
        }
    )
};

export async function gameFromID(req: Request, res: Response) {
    connection.execute(
        ``,
        [req.params["id"]],
        function (err, results, fields) {
            res.json(results)
        }
    )
};
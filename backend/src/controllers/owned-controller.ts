import type { Request, Response } from "express"
import { connection } from "../utils/db-connection"

export async function addToOwned(req: Request, res: Response) {
    connection.execute(
        ``,
        [req.params["id"]],
        function (err, results, fields) {
            res.json(results)
        }
    )
};

export async function listOwnedOfUser(req: Request, res: Response) {
    connection.execute(
        ``,
        [req.params["id"]],
        function (err, results, fields) {
            res.json(results)
        }
    )
};

export async function deleteFromOwned(req: Request, res: Response) {
    connection.execute(
        ``,
        [req.params["id"]],
        function (err, results, fields) {
            res.json(results)
        }
    )
};

export async function isOwned(req: Request, res: Response) {
    connection.execute(
        ``,
        [req.params["id"]],
        function (err, results, fields) {
            res.json(results)
        }
    )
};
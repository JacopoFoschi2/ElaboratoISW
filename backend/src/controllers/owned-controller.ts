import type { Request, Response } from "express"
import { connection } from "../utils/db-connection"

export async function allOwnedOfUser(req: Request, res: Response) {
    connection.execute(
        ``,
        [req.params["id"]],
        function (err, results, fields) {
            res.json(results)
        }
    )
};

export async function checkIfOwned(req: Request, res: Response) {
    connection.execute(
        ``,
        [req.params["id"]],
        function (err, results, fields) {
            res.json(results)
        }
    )
};

export async function addToOwned(req: Request, res: Response) {
    connection.execute(
        ``,
        [req.params["id"]],
        function (err, results, fields) {
            res.json(results)
        }
    )
};

export async function removeFromOwned(req: Request, res: Response) {
    connection.execute(
        ``,
        [req.params["id"]],
        function (err, results, fields) {
            res.json(results)
        }
    )
};
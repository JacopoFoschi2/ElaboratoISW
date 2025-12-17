import type { Request, Response } from "express"
import { connection } from "../utils/db-connection"

export async function allForums(req: Request, res: Response) {
    connection.execute(
        ``,
        [],
        function (err, results, fields) {
            res.json(results)
        }
    )
};

export async function allCommentsOfGame(req: Request, res: Response) {
    connection.execute(
        ``,
        [req.params['id']],
        function (err, results, fields) {
            res.json(results)
        }
    )
};

export async function addComment(req: Request, res: Response) {
    connection.execute(
        ``,
        [],
        function (err, results, fields) {
            res.json(results)
        }
    )
};

export async function modifyComment(req: Request, res: Response) {
    connection.execute(
        ``,
        [],
        function (err, results, fields) {
            res.json(results)
        }
    )
};

export async function removeComment(req: Request, res: Response) {
    connection.execute(
        ``,
        [],
        function (err, results, fields) {
            res.json(results)
        }
    )
};
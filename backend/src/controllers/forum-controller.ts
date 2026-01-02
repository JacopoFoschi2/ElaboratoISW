import type { Request, Response } from "express"
import { connection } from "../utils/db-connection"

export async function addComment(req: Request, res: Response) {
    connection.execute(
        ``,
        [],
        function (err, results, fields) {
            res.json(results)
        }
    )
};

export async function listForums(req: Request, res: Response) {
    connection.execute(
        ``,
        [],
        function (err, results, fields) {
            res.json(results)
        }
    )
};

export async function listCommentsOfGame(req: Request, res: Response) {
    connection.execute(
        ``,
        [req.params['id']],
        function (err, results, fields) {
            res.json(results)
        }
    )
};

export async function updateComment(req: Request, res: Response) {
    connection.execute(
        ``,
        [],
        function (err, results, fields) {
            res.json(results)
        }
    )
};

export async function deleteComment(req: Request, res: Response) {
    connection.execute(
        ``,
        [],
        function (err, results, fields) {
            res.json(results)
        }
    )
};
import { Request, Response } from "express"
import { connection } from "../utils/db_connection.js"

export async function allCommentsOfGame(req: Request, res: Response) {
    connection.execute(
        ``,
        [req.params.id],
        function (err, results, fields) {
            res.json(results)
        }
    )
};
import { Request, Response } from "express"
import { connection } from "../utils/db-connection.js"

export async function allReviewsOfGame(req: Request, res: Response) {
    connection.execute(
        ``,
        [],
        function (err, results, fields) {
            res.json(results)
        }
    )
};
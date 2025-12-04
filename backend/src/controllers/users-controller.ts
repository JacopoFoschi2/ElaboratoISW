import type { Request, Response } from "express"
import { connection } from "../utils/db-connection"

export async function allUsersAndPrivileges(req: Request, res: Response) {
    connection.execute(
        ``,
        [],
        function (err, results, fields) {
            res.json(results)
        }
    )
};
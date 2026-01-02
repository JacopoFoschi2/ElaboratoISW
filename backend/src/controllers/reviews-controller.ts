import type { Request, Response } from "express"
import { connection } from "../utils/db-connection"

export async function createReview(req: Request, res: Response) {
    connection.execute(
        ``,
        [],
        function (err, results, fields) {
            res.json(results)
        }
    )
};

export async function listReviewsOfGame(req: Request, res: Response) {
    connection.execute(
        ``,
        [],
        function (err, results, fields) {
            res.json(results)
        }
    )
};

export async function listReviewsOfUser(req: Request, res: Response) {
    connection.execute(
        ``,
        [],
        function (err, results, fields) {
            res.json(results)
        }
    )
};

export async function updateReview(req: Request, res: Response) {
    connection.execute(
        ``,
        [],
        function (err, results, fields) {
            res.json(results)
        }
    )
};

export async function deleteReview(req: Request, res: Response) {
    connection.execute(
        ``,
        [],
        function (err, results, fields) {
            res.json(results)
        }
    )
};
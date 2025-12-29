import type { Request, Response } from "express"
import { connection } from "../utils/db-connection"
import { handleQueryOutput } from "../utils/query-handling";

export async function createCategory(req: Request, res: Response) {
    connection.execute(
        `INSERT INTO categories (categoryName) VALUES (?)`,
        [req.body["categoryName"]],
        handleQueryOutput(201, res)
    );
};

export async function listCategories(req: Request, res: Response) {
    connection.execute(
        `SELECT * FROM categories`,
        [],
        handleQueryOutput(200, res)
    )
};

export async function updateCategory(req: Request, res: Response) {
    connection.execute(
        `UPDATE categories SET categoryName = ? WHERE categoryId = ?`,
        [req.body["categoryName"], req.params["id"]],
        handleQueryOutput(200, res)
    )
};

export async function deleteCategory(req: Request, res: Response) {
    connection.execute(
        `DELETE FROM categories WHERE categoryId = ?`,
        [req.params["id"]],
        handleQueryOutput(200, res)
    )
};
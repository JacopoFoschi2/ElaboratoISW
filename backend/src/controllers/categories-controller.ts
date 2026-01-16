import type { Request, Response } from "express"
import { connection } from "../utils/db-connection"
import { handleQueryOutput } from "../utils/query-handling";

export const createCategory = async(req: Request, res: Response) => {
    await connection.execute(
        `INSERT INTO categories (categoryName) VALUES (?)`,
        [req.body["categoryName"]],
        handleQueryOutput(201, res)
    );
};

export const listCategories = async(req: Request, res: Response) => {
    const [categories] = await connection.execute(
        `SELECT * FROM categories`,
        []
    )
    res.status(200).json(categories);
};

export const updateCategory = async(req: Request, res: Response) => {
    await connection.execute(
        `UPDATE categories SET categoryName = ? WHERE categoryId = ?`,
        [req.body["categoryName"], req.params["id"]],
        handleQueryOutput(200, res)
    )
};

export const deleteCategory = async(req: Request, res: Response) => {
    await connection.execute(
        `DELETE FROM categories WHERE categoryId = ?`,
        [req.params["id"]],
        handleQueryOutput(200, res)
    )
};
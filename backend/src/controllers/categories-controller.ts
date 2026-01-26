import type { Request, Response } from "express";
import { connection } from "../utils/db-connection";
import { requireUser } from "../utils/query-handling";

export const createCategory = async (req: Request, res: Response) => {
  const user = await requireUser(req, res, ["master"]);
  if (!user) {
    return;
  }

  await connection.execute(`INSERT INTO categories (categoryName) VALUES (?)`, [
    req.body["categoryName"],
  ]);
  res.sendStatus(201);
};

export const listCategories = async (req: Request, res: Response) => {
  const [categories] = await connection.execute(`SELECT * FROM categories`, []);
  res.status(200).json(categories);
};

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = await requireUser(req, res, ["master"]);
  if (!user) return;

  const { categoryName } = req.body;
const { categoryId } = req.params;

  if (!categoryId || !categoryName) {
    res.status(400).json({ error: "Missing categoryName or id" });
    return;
  }

 await connection.execute(
  `UPDATE categories SET categoryName = ? WHERE categoryId = ?`,
  [categoryName, categoryId]
);

  res.sendStatus(200);
};


export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = await requireUser(req, res, ["master"]);
  if (!user) return;

  const { categoryId } = req.params;

  if (!categoryId) {
    res.status(400).json({ error: "Missing categoryId" });
    return;
  }

  await connection.execute(
    `DELETE FROM categories WHERE categoryId = ?`,
    [categoryId]
  );

  res.sendStatus(200);
};

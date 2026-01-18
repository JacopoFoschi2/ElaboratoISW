import type { Request, Response } from "express";
import { connection } from "../utils/db-connection";
import { handleUser } from "../utils/auth";

export const createCategory = async (req: Request, res: Response) => {
  const user = await handleUser(req, ["admin", "master"]);
  if (!user) {
    res.status(403).send("Forbidden");
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

export const updateCategory = async (req: Request, res: Response) => {
  const user = await handleUser(req, ["admin", "master"]);
  if (!user) {
    res.status(403).send("Forbidden");
    return;
  }

  await connection.execute(
    `UPDATE categories SET categoryName = ? WHERE categoryId = ?`,
    [req.body["categoryName"], req.params["id"]]
  );
  res.sendStatus(200);
};

export const deleteCategory = async (req: Request, res: Response) => {
  const user = await handleUser(req, ["admin", "master"]);
  if (!user) {
    res.status(403).send("Forbidden");
    return;
  }

  await connection.execute(`DELETE FROM categories WHERE categoryId = ?`, [
    req.params["id"],
  ]);
  res.sendStatus(200);
};

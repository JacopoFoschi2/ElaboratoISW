import type { Request, Response } from "express";
import { connection } from "../utils/db-connection";
import { handleUser } from "../utils/auth"

export const addCategoryToGame = async (req: Request, res: Response) => {
  const user = await handleUser(req, res, ["master"]);
  if (!user) {
    return;
  }

  await connection.execute(
    "INSERT INTO game_categories (gameId, categoryId) VALUES (?, ?)",
    [req.body["gameId"], req.body["categoryId"]]
  );
  res.status(201).send("Category added to game successfully");
}

export const listCategoriesOfGame = async (req: Request, res: Response) => {
  const [categories] = await connection.execute(
    "SELECT categoryId FROM game_categories WHERE gameId = ?",
    [req.params["gameId"]]
  );
  res.status(200).json(categories);
}

export const updateCategoryOfGame = async (req: Request, res: Response) => {
  const user = await handleUser(req, res, ["master"]);
  if (!user) {
    return;
  }

  await connection.execute(
    "UPDATE game_categories SET categoryId = ? WHERE gameId = ? AND categoryId = ?",
    [req.body["newCategoryId"], req.body["gameId"], req.body["oldCategoryId"]]
  );
  res.status(200).send("Category updated for game successfully");
}

export const removeCategoryFromGame = async (req: Request, res: Response) => {
  const user = await handleUser(req, res, ["master"]);
  if (!user) {
    return;
  }

  await connection.execute(
    "DELETE FROM game_categories WHERE gameId = ? AND categoryId = ?",
    [req.params["gameId"], req.params["categoryId"]]
  );
  res.status(200).send("Category removed from game successfully");
}
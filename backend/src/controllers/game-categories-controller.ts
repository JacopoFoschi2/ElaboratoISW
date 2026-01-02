import type { Request, Response } from "express";
import { connection } from "../utils/db-connection";
import { handleQueryOutput } from "../utils/query-handling";

export async function addCategoryToGame(req: Request, res: Response) {
  connection.execute(
    "INSERT INTO game_categories (gameId, categoryId) VALUES (?, ?)",
    [req.body["gameId"], req.body["categoryId"]],
    handleQueryOutput(201, res)
  );
}

export async function listCategoriesOfGame(req: Request, res: Response) {
  connection.execute(
    "SELECT categoryId FROM game_categories WHERE gameId = ?",
    [req.params["gameId"]],
    handleQueryOutput(200, res)
  );
}

export async function updateCategoryOfGame(req: Request, res: Response) {
  connection.execute(
    "UPDATE game_categories SET categoryId = ? WHERE gameId = ? AND categoryId = ?",
    [req.body["newCategoryId"], req.body["gameId"], req.body["oldCategoryId"]],
    handleQueryOutput(200, res)
  );
}

export async function removeCategoryFromGame(req: Request, res: Response) {
  connection.execute(
    "DELETE FROM game_categories WHERE gameId = ? AND categoryId = ?",
    [req.params["gameId"], req.params["categoryId"]],
    handleQueryOutput(200, res)
  );
}
import type { Request, Response } from "express";
import { connection } from "../utils/db-connection";
import { handleUser } from "../utils/auth";
import { handleExists } from "../utils/query-handling";

export const addToWishlist = async (req: Request, res: Response) => {
  const user = await handleUser(req, res, ["user", "admin", "master"]);
  if (!user) {
    return;
  }

  await connection.execute(
    `INSERT INTO wishlist (userId, gameId) VALUES (?, ?)`,
    [user.userId, req.params["gameId"]]
  );
  res.status(201).send("Game added to wishlist");
};

export const listWishlistOfUser = async (req: Request, res: Response) => {
  const user = await handleUser(req, res, ["user", "admin", "master"]);
  if (!user) {
    return;
  }

  const [wishlist] = await connection.execute(
    `SELECT gameId FROM wishlist WHERE userId = ?`,
    [user.userId]
  );
  res.status(200).json(wishlist);
};

export const deleteFromWishlist = async (req: Request, res: Response) => {
  const user = await handleUser(req, res, ["user", "admin", "master"]);
  if (!user) {
    return;
  }

  await connection.execute(
    `DELETE FROM wishlist WHERE userId = ? AND gameId = ?`,
    [user.userId, req.params["gameId"]]
  );
  res.status(200).send("Game removed from wishlist");
};

export const isGameInWishlist = async (req: Request, res: Response) => {
  const user = await handleUser(req, res, ["user", "admin", "master"]);
  if (!user) {
    return;
  }

  handleExists(res, () =>
    checkWishlist(user.userId, Number(req.params["gameId"]))
  );
};

const checkWishlist = async (
  userId: number,
  gameId: number
): Promise<boolean> => {
  const [rows] = await connection.execute(
    `SELECT * FROM wishlist WHERE userId = ? AND gameId = ?`,
    [userId, gameId]
  );
  return Array.isArray(rows) && rows.length > 0;
};

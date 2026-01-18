import type { Request, Response } from "express";
import { connection } from "../utils/db-connection";
import { handleUser } from "../utils/auth";
import { handleExists } from "../utils/query-handling";

export const addToOwned = async (req: Request, res: Response) => {
  const user = await handleUser(req, res, ["user", "admin", "master"]);
  if (!user) return;

  await connection.execute(`INSERT INTO owned (userId, gameId) VALUES (?, ?)`, [
    user.userId,
    req.params["gameId"],
  ]);
  res.status(201).send("Added to owned successfully");
};

export const listOwnedOfUser = async (req: Request, res: Response) => {
  const user = await handleUser(req, res, ["user", "admin", "master"]);
  if (!user) return;

  const [owned] = await connection.execute(
    `SELECT o.gameId, gameName, gameCoverBin, gameCoverName 
    FROM owned as o inner join games as g on o.gameId = g.gameId 
    WHERE userId = ?`,
    [user.userId],
  );
  res.status(200).json(owned);
};

export const deleteFromOwned = async (req: Request, res: Response) => {
  const user = await handleUser(req, res, ["user", "admin", "master"]);
  if (!user) return;

  await connection.execute(
    `DELETE FROM owned WHERE userId = ? AND gameId = ?`,
    [user.userId, req.params["gameId"]],
  );
  res.status(200).send("Deleted from owned successfully");
};

export const isOwned = async (req: Request, res: Response) => {
  const user = await handleUser(req, res, ["user", "admin", "master"]);
  if (!user) return;

  handleExists(res, () =>
    checkOwned(user.userId, Number(req.params["gameId"])),
  );
};

const checkOwned = async (userId: number, gameId: number): Promise<boolean> => {
  const [rows] = await connection.execute(
    `SELECT 1 FROM owned WHERE userId = ? AND gameId = ?`,
    [userId, gameId],
  );
  return Array.isArray(rows) && rows.length > 0;
};

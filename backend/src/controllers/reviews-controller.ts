import type { Request, Response } from "express";
import { connection } from "../utils/db-connection";
import { handleResourceAuthorization, handleUser } from "../utils/auth";

export const createReview = async (req: Request, res: Response) => {
  const user = await handleUser(req, res, ["user", "admin", "master"]);
  if (!user) {
    return;
  }

  await connection.execute(
    `INSERT INTO reviews (gameId, userId, reviewRating, reviewBody, reviewTimeStamp) VALUES (?, ?, ?, ?, NOW())`,
    [
      req.params["gameId"],
      user.userId,
      req.body["reviewRating"],
      req.body["reviewBody"],
    ]
  );
  res.status(201).send("Review created successfully");
};

export const listReviewsOfGame = async (req: Request, res: Response) => {
  const [reviews] = await connection.execute(
    `SELECT * FROM reviews WHERE gameId = ? ORDER BY reviewTimeStamp DESC`,
    [req.params["gameId"]]
  );
  res.status(200).json(reviews);
};

export const listReviewsOfUser = async (req: Request, res: Response) => {
  const user = await handleUser(req, res, ["user", "admin", "master"]);
  if (!user) {
    return;
  }

  const [reviews] = await connection.execute(
    `SELECT * FROM reviews WHERE userId = ? ORDER BY reviewTimeStamp DESC`,
    [user.userId]
  );
  res.status(200).json(reviews);
};

export const getReviewOfUserForGame = async (req: Request, res: Response) => {
  const user = await handleUser(req, res, ["user", "admin", "master"]);
  if (!user) {
    return;
  }

  const [reviews] = await connection.execute(
    `SELECT * FROM reviews WHERE userId = ? AND gameId = ?`,
    [user.userId, req.params["gameId"]]
  );
  res.status(200).json(reviews);
};

export const updateReview = async (req: Request, res: Response) => {
  const user = await handleUser(req, res, ["user", "admin", "master"]);
  if (!user) {
    return;
  }

  const authorized = handleResourceAuthorization(res, user, user.userId, false);
  if (!authorized) {
    return;
  }

  await connection.execute(
    `UPDATE reviews SET reviewRating = ?, reviewBody = ?, reviewTimeStamp = NOW(), reviewWasEdited = true WHERE gameId = ? AND userId = ?`,
    [
      req.body["reviewRating"],
      req.body["reviewBody"],
      req.params["gameId"],
      user.userId,
    ]
  );
};

export const deleteReview = async (req: Request, res: Response) => {
  const user = await handleUser(req, res, ["user", "admin", "master"]);

  if (!user) {
    return;
  }

  const authorized = handleResourceAuthorization(res, user, user?.userId, true);
  if (!authorized) {
    return;
  }

  await connection.execute(
    `DELETE FROM reviews WHERE gameId = ? AND userId = ?`,
    [req.params["gameId"], user.userId]
  );
};

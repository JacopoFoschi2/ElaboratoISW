import type { Request, Response } from "express";
import { connection } from "../utils/db-connection";
import { handleUser, handleUserProfileAccess, unsetUser } from "../utils/auth";

export const listUsers = async (req: Request, res: Response) => {
  const user = await handleUser(req, ["master"]);
  if (!user) {
    res.status(401).send("This operation requires authentication.");
    return;
  }

  const [users] = await connection.execute(
    `SELECT userId, userUsername, userEmail, userRole FROM users`,
    []
  );
  res.status(200).json(users);
};

export const getUser = async (req: Request, res: Response) => {
  const user = await handleUser(req, ["user", "admin", "master"]);
  if (!user) {
    res.status(401).send("This operation requires authentication.");
    return;
  }

  const [userData] = await connection.execute(
    `SELECT * FROM users WHERE userId = ?`,
    [user.userId]
  );

  res.status(200).json(userData);
};

export const updateUserInfo = async (req: Request, res: Response) => {
  const user = await handleUser(req, ["user", "admin", "master"]);
  if (!user) {
    res.status(401).send("This operation requires authentication.");
    return;
  }

  if (!handleUserProfileAccess(user, user.userId, false)) {
    res.status(403).send("Forbidden");
    return;
  }

  await connection.execute(
    `UPDATE users SET userUsername = ?, userIconBin = ?, userIconName = ? WHERE userId = ?`,
    [
      req.body["username"],
      req.body["iconBin"],
      req.body["iconName"],
      req.params["userId"],
    ]
  );

  res.status(200).send("User information updated successfully.");
};

export const deleteUser = async (req: Request, res: Response) => {
  const user = await handleUser(req, ["user", "admin", "master"]);
  if (!user) {
    res.status(401).send("This operation requires authentication.");
    return;
  }

  if (!handleUserProfileAccess(user, Number(req.params["userId"]), true)) {
    res.status(403).send("Forbidden");
    return;
  }

  await connection.execute(`DELETE FROM users WHERE userId = ?`, [
    req.params["userId"],
  ]);

  if (user.userId === Number(req.params["userId"])) {
    unsetUser(res);
  }

  res.status(200).send("User deleted successfully.");
};

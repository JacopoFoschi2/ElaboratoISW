import type { Request, Response } from "express";
import { connection } from "../utils/db-connection";
import { unsetUser } from "../utils/auth";
import { requireProfileAccess, requireUser } from "../utils/query-handling";

export const listUsers = async (req: Request, res: Response) => {
  const user = await requireUser(req, res, ["master"]);
  if (!user) {
    return;
  }

  const [users] = await connection.execute(
    `SELECT userId, userUsername, userEmail, userRole FROM users`,
    []
  );
  res.status(200).json(users);
};

export const getUser = async (req: Request, res: Response) => {
  const user = await requireUser(req, res, ["user", "admin", "master"]);
  if (!user) {
    return;
  }

  const [userData] = await connection.execute(
    `SELECT userId, userUsername, userEmail, userRole, userIconBin, userIconName FROM users WHERE userId = ?`,
    [user.userId]
  );

  res.status(200).json(userData);
};

export const updateUserInfo = async (req: Request, res: Response) => {
  const user = await requireUser(req, res, ["user", "admin", "master"]);
  let iconBuffer: Buffer | null | undefined = undefined;

  if (req.body["iconBin"] && typeof req.body["iconBin"] === 'string') {
    iconBuffer = Buffer.from(req.body["iconBin"], 'base64');
  }

  if (!user) {
    return;
  }

  const hasAccess = requireProfileAccess(res, user, user.userId, false);
  if (!hasAccess) {
    return;
  }

  await connection.execute(
  iconBuffer !== undefined
    ? `UPDATE users 
       SET userUsername = ?, userIconBin = ?, userIconName = ? 
       WHERE userId = ?`
    : `UPDATE users 
       SET userUsername = ? 
       WHERE userId = ?`,
  iconBuffer !== undefined
    ? [
        req.body["username"],
        iconBuffer,
        req.body["iconName"],
        user.userId,
      ]
    : [
        req.body["username"],
        user.userId,
      ]
);

  res.status(200).send("User information updated successfully.");
};

export const deleteUser = async (req: Request, res: Response) => {
  const user = await requireUser(req, res, ["user", "admin", "master"]);
  if (!user) {
    return;
  }

  const hasAccess = requireProfileAccess(res, user, Number(req.params["userId"]), true);
  if (!hasAccess) {
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

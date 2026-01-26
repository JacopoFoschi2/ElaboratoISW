import type { Request, Response } from "express";
import { connection } from "../utils/db-connection";
import { requireProfileAccess, requireUser } from "../utils/query-handling";

export const addComment = async (req: Request, res: Response) => {
  const user = await requireUser(req, res, ["user", "admin", "master"]);
  if (!user) return;

  const [result]: any = await connection.execute(
    `INSERT INTO comments (gameId, userId, commentBody, commentTimeStamp)
     VALUES (?, ?, ?, NOW())`,
    [req.body.gameId, user.userId, req.body.commentBody]
  );

  const [rows]: any = await connection.execute(
    `SELECT 
        c.commentId,
        c.userId,
        c.commentBody,
        c.commentTimeStamp,
        c.commentWasEdited,
        u.userUsername,
        u.userIconBin,
        u.userIconName
     FROM comments c
     JOIN users u ON c.userId = u.userId
     WHERE c.commentId = ?`,
    [result.insertId]
  );

  res.status(201).json(rows[0]);
};


export const listForums = async (req: Request, res: Response) => {
  const [forums] = await connection.execute(
    `SELECT gameId, gameName, gameSmallBannerName, gameSmallBannerBin FROM games`,
    []
  );
  res.status(200).json(forums);
};

export const listForumsAsYouType = async (req: Request, res: Response) => {
  const [forums] = await connection.execute(
    `SELECT gameId, gameName
        FROM games
        WHERE gameName LIKE CONCAT('%', ?, '%') or 
        gameAlternateName like CONCAT('%', ?, '%')
        ORDER BY gameName DESC
        LIMIT 15`,
    [req.params["partialName"], req.params["partialName"]]
  );
  res.status(200).json(forums);
};

export const listForumsMatching = async (req: Request, res: Response) => {
  const [forums] = await connection.execute(
    `SELECT gameId, gameName, gameSmallBannerBin, gameSmallBannerName
        FROM games
        WHERE gameName LIKE CONCAT('%', ?, '%') or 
        gameAlternateName like CONCAT('%', ?, '%')
        ORDER BY gameName DESC`,
    [req.params["partialName"], req.params["partialName"]]
  );
  res.status(200).json(forums);
};

export const listCommentsOfGame = async (req: Request, res: Response) => {
  const [comments] = await connection.execute(
    `SELECT 
        c.commentId,
        c.userId,
        c.commentBody,
        c.commentTimeStamp,
        c.commentWasEdited,
        u.userUsername,
        u.userIconBin,
        u.userIconName
     FROM comments c
     JOIN users u ON c.userId = u.userId
     WHERE c.gameId = ?
     ORDER BY c.commentTimeStamp DESC`,
    [req.params["gameId"]]
  );

  res.status(200).json(comments);
};

export const getGameBanner = async (req: Request, res: Response) => {
  const [bannerData] = await connection.execute(
    `SELECT gameBigBannerBin, gameBigBannerName FROM games WHERE gameId = ?`,
    [req.params["gameId"]]
  );
  res.status(200).json(bannerData);
};

export const updateComment = async (req: Request, res: Response) => {
  const user = await requireUser(req, res, ["user", "admin", "master"]);
  if (!user) return;

  await connection.execute(
    `UPDATE comments 
     SET commentBody = ?, commentWasEdited = true 
     WHERE commentId = ? AND userId = ?`,
    [
      req.body.commentBody,
      req.params["commentId"],
      user.userId
    ]
  );

  res.status(200).json({
    commentId: req.params["commentId"],
    commentBody: req.body.commentBody
  });
};



import { RowDataPacket } from "mysql2";

export const deleteComment = async (req: Request, res: Response) => {
  const user = await requireUser(req, res, ["user", "admin", "master"]);
  if (!user) return;

  const commentId = req.params["commentId"];

  const [rows] = await connection.execute<RowDataPacket[]>(
    `SELECT userId FROM comments WHERE commentId = ?`,
    [commentId]
  );

  const comment = rows[0];
  if (!comment) {
    return res.status(404).send("Comment not found");
  }

  const commentOwnerId = comment["userId"] as number;

  const isOwner = user.userId === commentOwnerId;
  const isAdmin = user.userRole === "admin" || user.userRole === "master";

  if (!isOwner && !isAdmin) {
    return res.status(403).send("You are not allowed to delete this comment");
  }

  await connection.execute(
    `DELETE FROM comments WHERE commentId = ?`,
    [commentId]
  );

  return res.status(200).send("Comment deleted successfully");
};

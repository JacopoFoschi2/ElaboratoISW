import type { Request, Response } from "express";
import { connection } from "../utils/db-connection";
import { handleResourceAuthorization, handleUser } from "../utils/auth";

export const addComment = async (req: Request, res: Response) => {
  const user = await handleUser(req, ["user", "admin", "master"]);
  if (!user) {
    res.status(401).send("This operation requires authentication.");
    return;
  }

  await connection.execute(
    `INSERT INTO comments (gameId, userId, commentBody, commentTimeStamp) VALUES (?, ?, ?, NOW())`,
    [req.body["gameId"], user.userId, req.body["commentBody"]]
  );
  res.status(201).send("Comment added successfully");
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
    `SELECT commentBody, commentTimeStamp, commentWasEdited, userUsername, userIconBin, userIconName 
        FROM comments as c join users as u ON c.userId = u.userId WHERE gameId = ? ORDER BY commentTimeStamp DESC`,
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
  const user = await handleUser(req, ["user", "admin", "master"]);
  if (!user) {
    res.status(401).send("This operation requires authentication.");
    return;
  }
  if (!handleResourceAuthorization(user, req.body["userId"], false)) {
    res.status(403).send("Forbidden");
    return;
  }

  await connection.execute(
    `INSERT INTO comments (commentBody, commentWasEdited) VALUES (?, true) WHERE commentId = ?`,
    [req.body["commentBody"], req.params["commentId"]]
  );
  res.status(200).send("Comment updated successfully");
};

export const deleteComment = async (req: Request, res: Response) => {
  const user = await handleUser(req, ["user", "admin", "master"]);
  if (!user) {
    res.status(401).send("This operation requires authentication.");
    return;
  }
  if (!handleResourceAuthorization(user, req.body["userId"], true)) {
    res.status(403).send("Forbidden");
    return;
  }

  await connection.execute(`DELETE FROM comments WHERE commentId = ?`, [
    req.params["commentId"],
  ]);
  res.status(200).send("Comment deleted successfully");
};

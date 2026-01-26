import type { Request, Response } from "express";
import { connection } from "../utils/db-connection";
import { requireProfileAccess, requireUser } from "../utils/query-handling";

export const createReview = async (req: Request, res: Response) => {
  const user = await requireUser(req, res, ["user", "admin", "master"]);
  if (!user) {
    return;
  }

  await connection.execute(
  `
  INSERT INTO reviews 
    (gameId, userId, reviewTitle, reviewRating, reviewBody, reviewTimeStamp)
  VALUES (?, ?, ?, ?, ?, NOW())
  `,
  [
    req.params["gameId"],
    user.userId,
    req.body["reviewTitle"],   
    req.body["reviewRating"],
    req.body["reviewBody"]
  ]
);

  res.status(201).send("Review created successfully");
};

export const listReviewsOfGame = async (req: Request, res: Response) => {
  const user = await requireUser(req, res, ["user", "admin", "master"], false);

  let query = `
    SELECT *
    FROM reviews as r inner join users as u on r.userId = u.userId
    WHERE gameId = ?
  `;

  const params: any[] = [req.params["gameId"]];

  if (user) {
    query += `
      ORDER BY (u.userId = ?) DESC, reviewTimeStamp DESC
    `;
    params.push(user.userId);
  } else {
    query += `
      ORDER BY reviewTimeStamp DESC
    `;
  }

  const [reviews] = await connection.execute(query, params);

  res.status(200).json(reviews);
};

export const getReviewsOfUser = async (req: Request, res: Response) => {
  const user = await requireUser(req, res, ["user", "admin", "master"]);
  if (!user) {
    return;
  }

  const [reviews] = await connection.execute(
    `SELECT * FROM reviews WHERE userId = ?`,
    [user.userId]
  );
  res.status(200).json(reviews);
};

export const canUserReviewGame = async (req: Request, res: Response) => {
  const user = await requireUser(req, res, ["user", "admin", "master"]);
  if (!user) {
    return;
  }

  const [review] = await connection.execute(
    'SELECT 1 FROM reviews WHERE gameId = ? AND userId = ?',
    [req.params["gameId"], user.userId]
  );

  if (Array.isArray(review) && review.length > 0) {
    res.status(200).json({ canReview: false });
  } else {
    res.status(200).json({ canReview: true });
  }
};

export const updateReview = async (req: Request, res: Response): Promise<Response | void> => {
  const user = await requireUser(req, res, ["user", "admin", "master"]);
  if (!user) return;

  const [result] = await connection.execute(
    `
    UPDATE reviews
    SET
      reviewRating = ?,
      reviewBody = ?,
      reviewTimeStamp = NOW(),
      reviewWasEdited = true
    WHERE gameId = ? AND userId = ?
    `,
    [
      req.body["reviewRating"],
      req.body["reviewBody"],
      req.params["gameId"],
      user.userId
    ]
  );

  const info = result as any;

  if (info.affectedRows === 0) {
    return res.status(403).json({
      message: "You can only update your own review"
    });
  }

  return res.status(200).json({
    message: "Review updated successfully"
  });
};



export const deleteReview = async (req: Request, res: Response): Promise<Response | void> => {
  const user = await requireUser(req, res, ["user", "admin", "master"]);
  if (!user) return;

  const [result] = await connection.execute(
    `
    DELETE FROM reviews
    WHERE gameId = ? AND userId = ?
    `,
    [
      req.params["gameId"],
      user.userId
    ]
  );

  const info = result as any;

  if (info.affectedRows === 0) {
    return res.status(403).json({
      message: "You can only delete your own review"
    });
  }

  return res.status(200).json({
    message: "Review deleted successfully"
  });
};



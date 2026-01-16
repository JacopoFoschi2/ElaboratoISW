import { Response } from "express";

/**
 * Handles existence check queries and sends appropriate HTTP responses.
 *
 * @param res - The Express Response object used to send the HTTP response.
 * @param f - An asynchronous function that returns a Promise resolving to a boolean indicating existence.
 */
export const handleExists = async (
  res: Response,
  f: () => Promise<boolean>
) => {
  try {
    const isTaken = await f();
    res.status(200).json({ exists: isTaken });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

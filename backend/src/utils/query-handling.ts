import { Request, Response } from "express";
import { User, UserRole } from "../types/user";
import { handleUser, handleUserProfileAccess } from "./auth";

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

/**
 * Requires user authentication and appropriate roles for the request.
 * @param req - The Express Request object containing the HTTP request.
 * @param res - The Express Response object used to send the HTTP response.
 * @param requiredRoles - An array of UserRole strings specifying the roles required for access.
 * @returns The authenticated User object if authentication is successful; otherwise, null.
 */
export const requireUser = async (req: Request, res: Response, requiredRoles: UserRole[], shouldItThrowError: boolean = true): Promise<User | null> => {
  const user = await handleUser(req, requiredRoles);

  if (!user && shouldItThrowError) {
    throw401(res);
    return null;
  } else if (!user) {
    return null;
  }

  return user;
}

const throw401 = (res: Response) => {
  res.status(401).send("This operation requires authentication.");
};

/**
 * Requires user profile access authorization for the request.
 * @param res - The Express Response object used to send the HTTP response.
 * @param user - The authenticated User object making the request.
 * @param targetUserId - The ID of the user profile being accessed.
 * @param allowAdmin - A boolean indicating whether admin users are allowed access.
 * @returns True if access is authorized; otherwise, false.
 */
export const requireProfileAccess = (res: Response, user: User, targetUserId: number, allowAdmin: boolean): boolean => {
  const allowed = handleUserProfileAccess(user, targetUserId, allowAdmin);

  if (!allowed) {
    res.status(403).send("Forbidden");
    return false;
  }

  return true;
};
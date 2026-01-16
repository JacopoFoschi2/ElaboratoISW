import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User, UserRole } from "../types/user";

// Utilizzare una variabile d'ambiente per il secret in progetti reali!
// E anche un secret più complesso.
const JWT_SECRET = "foo";
const COOKIE_NAME = "site-access-token";

/**
 * Codifies the user in an access token and sets it as a cookie.
 * Used during registration and login.
 */
export const setUser = (req: Request, res: Response, user: any) => {
  // Create the access token with JWT
  const accessToken = jwt.sign(user, JWT_SECRET, { expiresIn: "1 day" });
  // Set the access token as a cookie
  res.cookie(COOKIE_NAME, accessToken, {
    maxAge: 86400000, // 1 day in milliseconds
    httpOnly: true,
    sameSite: true,
    // secure: true
  });
};

/**
 * Decodes and verifies the access token, returning the user.
 * Used to check if the user is logged in.
 */
export const getUser = (req: Request, res: Response) => {
  // Get the access token cookie
  const accessToken = req.cookies[COOKIE_NAME];
  // Return the user data contained in the access token, or null if the token is missing or invalid
  if (!accessToken) return null;
  try {
    const user = jwt.verify(accessToken, JWT_SECRET) as User;
    return user;
  } catch {
    return null;
  }
};

/**
 * Deletes the cookie containing the access token.
 * Used to perform logout.
 */
export const unsetUser = (req: Request, res: Response) => {
  // Delete the access token cookie
  res.clearCookie(COOKIE_NAME);
};

/**
 * Handles user authentication and role verification.
 *
 * @param req - The Express Request object containing the user information.
 * @param res - The Express Response object used to send the HTTP response.
 * @param requiredRoles - An array of roles that are permitted to access the resource.
 * @returns A Promise that resolves to the authenticated User object if successful, or undefined if authentication or authorization fails.
 */
export const handleUser = async (
  req: Request,
  res: Response,
  requiredRoles: UserRole[]
): Promise<User | undefined> => {
  const user = getUser(req, res);
  if (!user) {
    res.sendStatus(401);
    return undefined;
  }

  if (!handleRole(res, user.userRole, requiredRoles)) {
    return undefined;
  }
  return user;
};

/**
 * Handles authorization by checking if the user is allowed to operate on a resource.
 *
 * @param res - The Express Response object used to send the HTTP response.
 * @param user - The authenticated User object.
 * @param ownerOfResource - The ID of the user who owns the resource.
 * @param canAdminsOperate - A boolean indicating whether admin users are allowed to operate on the resource.
 * @returns A boolean indicating whether the user is authorized to operate on the resource.
 */
export const handleResourceAuthorization = (res: Response, user: User, ownerOfResource: number, canAdminsOperate: boolean) => {
  if (user.userId === ownerOfResource) {
    return true;
  }
  if (canAdminsOperate && (user.userRole === "admin" || user.userRole === "master")) {
    return true;
  }
  res.status(403).send("You are not allowed to operate on this resource");
  return false;
};

const handleRole = (res: Response, role: UserRole, requiredRoles: UserRole[]) => {
  if (!requiredRoles.includes(role)) {
    res.status(403).send("Forbidden");
    return false;
  }
  return true;
};

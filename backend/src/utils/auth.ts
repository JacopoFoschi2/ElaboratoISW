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
 * @param res - The Express Response object used to send the HTTP response.
 * @param user - The user data to be encoded in the access token.
 */
export const setUser = (res: Response, user: any) => {
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
 * @param req - The Express Request object containing the user information.
 * @returns The User object if the token is valid, or null if the token is missing or invalid.
 */
export const getUser = (req: Request) => {
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
 * @param res - The Express Response object used to send the HTTP response.
 */
export const unsetUser = (res: Response) => {
  // Delete the access token cookie
  res.clearCookie(COOKIE_NAME);
};

/**
 * Checks if the user's role is included in the required roles.
 * @param role - The role of the user.
 * @param requiredRoles - An array of roles that are permitted to access the resource.
 * @returns A boolean indicating whether the user's role is included in the required roles.
 */
const handleRole = (
  role: UserRole,
  requiredRoles: UserRole[]
) => {
  return requiredRoles.includes(role);
};

/**
 * Handles user authentication and role verification.
 *
 * @param req - The Express Request object containing the user information.
 * @param requiredRoles - An array of roles that are permitted to access the resource.
 * @returns A Promise that resolves to the authenticated User object if successful, or undefined if authentication or authorization fails.
 */
export const handleUser = async (
  req: Request,
  requiredRoles: UserRole[]
): Promise<User | null> => {
  const user = getUser(req);
  if (!user) {
    return null;
  }

  if (!handleRole(user.userRole, requiredRoles)) {
    return null;
  }
  return user;
};

/**
 * Handles authorization by checking if the user is the owner of a resource or has an allowed role.
 * @param user - The authenticated User object.
 * @param ownerId - The ID of the user who owns the resource.
 * @param allowedRoles - An array of roles that are permitted to operate on the resource.
 * @returns A boolean indicating whether the user is authorized to operate on the resource.
 */
const handleOwnershipAuthorization = (
  user: User,
  ownerId: number,
  allowedRoles: UserRole[]
): boolean => {
  if (user.userId === ownerId) {
    return true;
  }
  if (allowedRoles.includes(user.userRole)) {
    return true;
  }
  return false;
};

/**
 * Handles authorization by checking if the user is allowed to operate on a resource.
 *
 * @param user - The authenticated User object.
 * @param ownerOfResource - The ID of the user who owns the resource.
 * @param canAdminsOperate - A boolean indicating whether admin users are allowed to operate on the resource.
 * @returns A boolean indicating whether the user is authorized to operate on the resource.
 */
export const handleResourceAuthorization = (
  user: User,
  ownerOfResource: number,
  canAdminsOperate: boolean
): boolean => {
  const rolesAllowed: UserRole[] = canAdminsOperate ? ["admin", "master"] : [];
  return handleOwnershipAuthorization(
    user,
    ownerOfResource,
    rolesAllowed
  );
};

/**
 * Handles authorization for accessing user profiles.
 * @param user - The authenticated User object.
 * @param profileUserId - The ID of the user whose profile is being accessed.
 * @param canMastersOperate - A boolean indicating whether master users are allowed to access the profile.
 * @returns A boolean indicating whether the user is authorized to access the profile.
 */
export const handleUserProfileAccess = (
  user: User,
  profileUserId: number,
  canMastersOperate: boolean
): boolean => {
  const rolesAllowed: UserRole[] = canMastersOperate ? ["master"] : [];
  return handleOwnershipAuthorization(
    user,
    profileUserId,
    rolesAllowed
  );
};

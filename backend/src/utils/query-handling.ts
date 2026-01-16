import { Request, Response } from "express";
import { User } from "../types/user";
import { getUser } from "./auth";

/**
 * Handles existence check queries and sends appropriate HTTP responses.
 * 
 * @param res - The Express Response object used to send the HTTP response.
 * @param f - An asynchronous function that returns a Promise resolving to a boolean indicating existence.
 */
export const handleExists = async (res: Response, f: () => Promise<boolean>) => {
  try {
      const isTaken = await f();
      res.status(200).json({ "exists": isTaken });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
}

/**
 * Handles user authentication and role verification.
 *
 * @param req - The Express Request object containing the user information.
 * @param res - The Express Response object used to send the HTTP response.
 * @param requiredRoles - An array of roles that are permitted to access the resource.
 * @returns A Promise that resolves to the authenticated User object if successful, or undefined if authentication or authorization fails.
 */
export const handleUser = async (req: Request, res: Response, requiredRoles: string[]): Promise<User | undefined> => {
  const user = getUser(req, res);
      if (!user) {
          res.sendStatus(401);
          return undefined;
      }
      
      if(!handleRole(res, user.userRole, requiredRoles)) {
          return undefined;
      }
      return user;
}

const handleRole = (res: Response, role: string, requiredRoles: string[]) => {
     if (!requiredRoles.includes(role)) {
         res.status(403).send("Forbidden");
         return false;
     }
     return true;
 }
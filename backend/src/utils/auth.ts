import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { User } from "../types/user"

// Utilizzare una variabile d'ambiente per il secret in progetti reali!
// E anche un secret più complesso.
const JWT_SECRET = "foo"
const COOKIE_NAME = "site-access-token"

/**
 * Codifies the user in an access token and sets it as a cookie.
 * Used during registration and login.
 */
export const setUser = (req: Request, res: Response, user: any) => {
  // Create the access token with JWT
  const accessToken = jwt.sign(user, JWT_SECRET, { expiresIn: "1 day" })
  // Set the access token as a cookie
  res.cookie(COOKIE_NAME, accessToken, {
    maxAge: 86400000, // 1 day in milliseconds
    httpOnly: true,
    sameSite: true,
    // secure: true
  })
}

/**
 * Decodes and verifies the access token, returning the user.
 * Used to check if the user is logged in.
 */
export const getUser = (req: Request, res: Response) => {
  // Get the access token cookie
  const accessToken = req.cookies[COOKIE_NAME]
  // Return the user data contained in the access token, or null if the token is missing or invalid
  if (!accessToken) return null
  try {
    const user = jwt.verify(accessToken, JWT_SECRET) as User
    return user
  } catch {
    return null
  }
}

/**
 * Deletes the cookie containing the access token.
 * Used to perform logout.
 */
export const unsetUser = (req: Request, res: Response) => {
  // Delete the access token cookie
  res.clearCookie(COOKIE_NAME)
}
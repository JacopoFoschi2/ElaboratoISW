import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { User } from "../types/user"

// Utilizzare una variabile d'ambiente per il secret in progetti reali!
// E anche un secret più complesso.
const JWT_SECRET = "foo"
const COOKIE_NAME = "vuepost-access-token"

/**
 * Codifica l'utente in un access token e lo imposta come cookie.
 * Usato in fase di registrazione e login.
 */
export const setUser = (req: Request, res: Response, user: User) => {
  // Crea l'access token con JWT
  const accessToken = jwt.sign(user, JWT_SECRET, { expiresIn: "1 day" })
  // Imposta l'access token come cookie
  res.cookie(COOKIE_NAME, accessToken, {
    maxAge: 86400000, // 1 giorno in millisecondi
    httpOnly: true,
    sameSite: true,
    // secure: true
  })
}

/**
 * Decodifica e verifica l'access token, restituendo l'utente.
 * Usato per verificare se l'utente ha effettuato il login.
 */
export const getUser = (req: Request, res: Response) => {
  // Ottiene il cookie dell'access token
  const accessToken = req.cookies[COOKIE_NAME]
  // Restituisce i dati dell'utente contenuti nell'access token, oppure null se il token è mancante o invalido
  if (!accessToken) return null
  try {
    const user = jwt.verify(accessToken, JWT_SECRET) as User
    return user
  } catch {
    return null
  }
}

/**
 * Cancella il cookie contente l'access token.
 * Usato per effettuare il logout.
 */
export const unsetUser = (req: Request, res: Response) => {
  // Cancella il cookie dell'access token
  res.clearCookie(COOKIE_NAME)
}
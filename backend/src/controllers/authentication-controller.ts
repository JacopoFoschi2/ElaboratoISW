import bcrypt from "bcrypt";
import { Request, Response } from "express";
import {
  getUser,
  setUser,
  unsetUser,
} from "../utils/auth";
import { User } from "../types/user";
import { connection } from "../utils/db-connection";
import { handleExists, requireUser, requireProfileAccess } from "../utils/query-handling";

const checkUsername = async (username: string | undefined) => {
  const [users] = await connection.execute(
    `SELECT 1 FROM users WHERE userUsername = ? LIMIT 1`,
    [username]
  );
  return Array.isArray(users) && users.length > 0;
};

const checkEmail = async (email: string | undefined) => {
  const [emails] = await connection.execute(
    `SELECT 1 FROM users WHERE userEmail = ? LIMIT 1`,
    [email]
  );
  return Array.isArray(emails) && emails.length > 0;
};

export const createUser = async (req: Request, res: Response) => {
  // Block the request if the user is already logged in
  const user = getUser(req);
  if (user) {
    res.status(401).send("This operation requires logout.");
    return;
  }

  // Extract username and password from the request body
  const username = req.body["username"];
  const password = req.body["password"];

  // Check if the username is available
  if (await checkUsername(username)) {
    res.status(400).send("Username already in use.");
    return;
  }

  // Create the password hash to avoid storing it in plain text
  const passwordHash = await bcrypt.hash(password, 10);

  // Insert the user into the database
  await connection.execute(
    `INSERT INTO users (userUsername, userEmail, userPassword) 
    VALUES (?, ?, ?)`,
    [
      username,
      req.body["email"],
      passwordHash,
    ]
  );

  // Extract data for the new user
  const [results] = await connection.execute(
    "SELECT userId, userUsername, userEmail, userRole FROM users WHERE userUsername=?",
    [username]
  );
  const newUser = (results as User[])[0];

  // Create a JWT containing the user data and set it as a cookie
  setUser(res, newUser);

  res.json({ message: "Registration successful" });
};

export const isUsernameTaken = async (req: Request, res: Response) => {
  await handleExists(res, () => checkUsername(req.params["username"]));
};

export const isEmailRegistered = async (req: Request, res: Response) => {
  await handleExists(res, () => checkEmail(req.params["email"]));
};

export const login = async (req: Request, res: Response) => {
  // Block the request if the user is already logged in
  const user = getUser(req);
  if (user) {
    res.status(401).send("This operation requires logout.");
    return;
  }

  // Extract email and password from the request body
  const { email, password } = req.body;

  // Execute the database query to get user data based on the email
  const [results] = await connection.execute(
    "SELECT userId, userUsername, userEmail, userPassword, userRole FROM users WHERE userEmail=?",
    [email]
  );

  // Error if the user was not found
  if (!Array.isArray(results) || results.length == 0) {
    res.status(400).send("Invalid credentials.");
    return;
  }

  const userData = results[0] as any;

  // Compare the hash of the provided password with the one in the database
  const correctPassword = await bcrypt.compare(password, userData.userPassword);

  // Error if the password is incorrect
  if (!correctPassword) {
    res.status(400).send("Invalid credentials.");
    return;
  }

  // Important! Remove the password from the user object so it is not included in the JWT
  delete userData.userPassword;

  // Create a JWT containing the user data and set it as a cookie
  setUser(res, userData);

  res.json({ message: "Login successful" });
};

export const logout = async (req: Request, res: Response) => {
  // Block the request if the user is not logged in
  const user = getUser(req);
  if (!user) {
    res.status(401).send("This operation requires authentication.");
    return;
  }

  // Delete the cookie containing the access token
  unsetUser(res);

  res.json({ message: "Logout successful" });
};

export const updateUserPassword = async (req: Request, res: Response) => {
  const user = await requireUser(req, res, ["user", "admin", "master"]);
  if (!user) {
    return;
  }

  if (!requireProfileAccess(res, user, user.userId, false)) {
    return;
  }

  const [passwordData] = await connection.execute(
    "SELECT userPassword FROM users WHERE userUsername=?",
    [user.userUsername]
  );
  const currentPasswordHash = (passwordData as any)[0].userPassword;

  const currentPassword = req.body["currentPassword"];
  const passwordMatches = await bcrypt.compare(
    currentPassword,
    currentPasswordHash
  );

  if (!passwordMatches) {
    res.status(400).send("Current password is incorrect");
    return;
  }

  const newPassword = req.body["password"];
  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  await connection.execute(
    `UPDATE users SET userPassword = ? WHERE userId = ?`,
    [newPasswordHash, req.params["userId"]]
  );
  unsetUser(res);
  const updatedUser: User | null = getUser(req);
  setUser(res, updatedUser);

  res.status(200).send("Password updated successfully");
};

export const getProfile = async (req: Request, res: Response) => {
  // Decode the content of the access token, which contains the user data, and send it in the response
  const user = getUser(req);
  res.json(user);
};

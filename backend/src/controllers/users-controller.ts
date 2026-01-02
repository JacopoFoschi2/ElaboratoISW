import type { Request, Response } from "express"
import { connection } from "../utils/db-connection"
import { handleExists, handleQueryOutput } from "../utils/query-handling"

export async function createUser(req: Request, res: Response) {
    connection.execute(
        `INSERT INTO users (userUsername, userEmail, userPassword, userIconBin, userIconName, userRole) VALUES (?, ?, ?, ?, ?, ?)`,
        [req.body["username"], req.body["email"], req.body["password"], req.body["iconBin"], req.body["iconName"], req.body["role"]],
        handleQueryOutput(201, res)
    )
};

export async function listUsers(req: Request, res: Response) {
    connection.execute(
        `SELECT userId, userUsername, userEmail, userRole FROM users`,
        [],
        handleQueryOutput(200, res)
    )
};

export async function getUser(req: Request, res: Response) {
    connection.execute(
        `SELECT userId, userUsername, userEmail, userIconBin, userIconName, userRole FROM users WHERE userId = ?`,
        [req.params["userId"]],
        handleQueryOutput(200, res)
    )
}

export async function updateUserInfo(req: Request, res: Response) {
    connection.execute(
        `UPDATE users SET userUsername = ?, userIconBin = ?, userIconName = ? WHERE userId = ?`,
        [req.body["username"], req.body["iconBin"], req.body["iconName"], req.params["userId"]],
        handleQueryOutput(200, res)
    )
};

export async function updateUserPassword(req: Request, res: Response) {
    connection.execute(
        `UPDATE users SET userPassword = ? WHERE userId = ?`,
        [req.body["password"], req.params["userId"]],
        handleQueryOutput(200, res)
    )
};

export async function deleteUser(req: Request, res: Response) {
    connection.execute(
        `DELETE FROM users WHERE userId = ?`,
        [req.params["userId"]],
        handleQueryOutput(200, res)
    )
};

export async function isUsernameTaken(req: Request, res: Response) {
    connection.execute(
        `SELECT userUsername FROM users WHERE userUsername = ?`,
        [req.params["username"]],
        handleExists(res)
    )
};

export async function isEmailRegistered(req: Request, res: Response) {
    connection.execute(
        `SELECT userEmail FROM users WHERE userEmail = ?`,
        [req.params["email"]],
        handleExists(res)
    )
};
import type { Request, Response } from "express"
import { connection } from "../utils/db-connection"
import { handleExists, handleQueryOutput } from "../utils/query-handling"

export const listUsers = async (req: Request, res: Response) => {
    await connection.execute(
        `SELECT userId, userUsername, userEmail, userRole FROM users`,
        [],
        handleQueryOutput(200, res)
    )
};

export const getUser = async (req: Request, res: Response) => {
    await connection.execute(
        `SELECT userId, userUsername, userEmail, userIconBin, userIconName, userRole FROM users WHERE userId = ?`,
        [req.params["userId"]],
        handleQueryOutput(200, res)
    )
}

export const updateUserInfo = async (req: Request, res: Response) => {
    await connection.execute(
        `UPDATE users SET userUsername = ?, userIconBin = ?, userIconName = ? WHERE userId = ?`,
        [req.body["username"], req.body["iconBin"], req.body["iconName"], req.params["userId"]],
        handleQueryOutput(200, res)
    )
};

export const updateUserPassword = async (req: Request, res: Response) => {
    await connection.execute(
        `UPDATE users SET userPassword = ? WHERE userId = ?`,
        [req.body["password"], req.params["userId"]],
        handleQueryOutput(200, res)
    )
};

export const deleteUser = async (req: Request, res: Response) => {
    await connection.execute(
        `DELETE FROM users WHERE userId = ?`,
        [req.params["userId"]],
        handleQueryOutput(200, res)
    )
};
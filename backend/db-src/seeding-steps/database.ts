import fs from "fs";
import path from "path";
import { connection } from "../utils/connection";

const sqlFilePath = path.resolve(__dirname, "../create-db.sql");
const sqlFileContent = fs.readFileSync(sqlFilePath, "utf-8");

export async function createDB() {
    connection.execute(sqlFileContent, function (err: any, results: any, fields: any) {
        if (err) {
            console.error("Error creating database:", err);
        } else {
            console.log("Database created successfully.");
        }
    });
}
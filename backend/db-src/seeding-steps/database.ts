import fs from "fs";
import path from "path";
import { CreateDbConnection } from "../utils/connection";

const sqlFilePath = path.resolve(process.cwd(), "db-src/sql/create-db.sql");
const sqlFileContent = fs.readFileSync(sqlFilePath, "utf-8");

async function executeSQL(){
    return new Promise<void>((resolve, reject) => {
        CreateDbConnection.query(sqlFileContent, function (err: any, results: any, fields: any) {
            if (err) {
                reject(err);
            } else {
                console.log("Database and tables created successfully.");
                resolve();
            }
        });
    });
}

export async function createDB() {
    await executeSQL();
    CreateDbConnection.end();
}
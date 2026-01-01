import fs from "fs";
import path from "path";
import { createDbConnection } from "../utils/connection";
import { readTextFile, executeSQL } from "../utils/seeding-utils";

const sqlFileContent = readTextFile("db-src/sql/create-db.sql");

export async function createDB() {
    await executeSQL(createDbConnection, sqlFileContent, "Database and tables created successfully.");
    createDbConnection.end();
}
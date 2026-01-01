import { Connection } from "mysql2";
import { readTextFile, executeSQL } from "../utils/seeding-utils";

const sqlFileContent = readTextFile("db-src/sql/seed-categories.sql");

export async function seedCategories(connection: Connection) {
    await executeSQL(connection, sqlFileContent, "Categories seeding completed.");
}
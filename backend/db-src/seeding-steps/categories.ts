import { connection } from "../utils/connection";
import { readTextFile, executeSQL } from "../utils/seeding-utils";

const conn = connection;
const sqlFileContent = readTextFile("db-src/sql/seed-categories.sql");

export async function createDB() {
    await executeSQL(conn, sqlFileContent, "Categories seeding completed.");
    conn.end();
}
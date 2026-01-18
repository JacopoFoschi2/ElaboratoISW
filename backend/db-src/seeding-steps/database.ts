import { createDbConnection } from "../utils/connection";
import { readTextFile, executeSQL } from "../utils/seeding-utils";

const conn = createDbConnection;
const sqlFileContent = readTextFile("db-src/sql/create-db.sql");

export async function createDB() {
    const conn = createDbConnection();
    await executeSQL(conn, sqlFileContent, "Database and tables created successfully.");
    conn.end();
}
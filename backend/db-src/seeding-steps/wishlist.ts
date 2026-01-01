import { connection } from "../utils/connection";
import { readTextFile, executeSQL } from "../utils/seeding-utils";

const conn = connection;
const sqlFileContent = readTextFile("db-src/sql/seed-wishlist.sql");

export async function createDB() {
    await executeSQL(conn, sqlFileContent, "Wishlist seeding completed.");
    conn.end();
}
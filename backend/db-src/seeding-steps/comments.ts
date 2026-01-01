import { Connection } from "mysql2";
import { readTextFile, executeSQL } from "../utils/seeding-utils";

const sqlFileContent = readTextFile("db-src/sql/seed-comments.sql");

export async function seedComments(connection: Connection) {
    await executeSQL(connection, sqlFileContent, "Comments seeding completed.");
}
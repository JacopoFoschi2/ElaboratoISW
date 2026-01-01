import { Connection } from "mysql2";
import { readTextFile, executeSQL } from "../utils/seeding-utils";

const sqlFileContent = readTextFile("db-src/sql/seed-reviews.sql");

export async function seedReviews(connection: Connection) {
    await executeSQL(connection, sqlFileContent, "Reviews seeding completed.");
}
import { Connection } from "mysql2";
import { readTextFile, executeSQL } from "../utils/seeding-utils";

const sqlFileContent = readTextFile("db-src/sql/seed-owned.sql");

export async function seedOwned(connection: Connection) {
  await executeSQL(connection, sqlFileContent, "Owned seeding completed.");
}
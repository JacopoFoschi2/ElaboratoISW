import { Connection } from "mysql2";
import { readTextFile, executeSQL } from "../utils/seeding-utils";

const sqlFileContent = readTextFile("db-src/sql/seed-wishlist.sql");

export async function seedWishlist(connection: Connection) {
    await executeSQL(connection, sqlFileContent, "Wishlist seeding completed.");
}
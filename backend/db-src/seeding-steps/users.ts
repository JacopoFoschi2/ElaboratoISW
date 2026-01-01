import { User } from "../types/user";
import {
  getBaseAssetsPath,
  insertRecord,
  readImage,
  readJson,
  seedData,
} from "../utils/seeding-utils";
import { Connection } from "mysql2";

const users: User[] = readJson("db-src/data/users.json");

const userImages = "users";
const assetsPath = getBaseAssetsPath("db-src/assets");

const query = `
  INSERT INTO users (
    userEmail,
    userUsername,
    userPassword,
    userIconBin,
    userIconName,
    userRole
  )
  VALUES (?, ?, ?, ?, ?, ?)
  `;

function insertUser(user: User, connection: Connection): Promise<void> {
  const userIconBin = readImage(assetsPath, userImages, user.userIconName);
  const params = [
    user.userEmail,
    user.userUsername,
    user.userPassword,
    userIconBin,
    user.userIconName,
    user.userRole,
  ];
  return insertRecord(connection, params, query);
}

export async function seedUsers(connection: Connection) {
  await seedData(
    users,
    insertUser,
    connection,
    "Error seeding users:",
    "Users seeding completed."
  );
}

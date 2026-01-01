import { createDB } from "./seeding-steps/database";
import { seedGames } from "./seeding-steps/games";
import { seedUsers } from "./seeding-steps/users";
import { connection } from "./utils/connection";

async function main() {
    await createDB();
    const conn = connection;
    await seedGames(conn);
    await seedUsers(conn);
    conn.end();
}

main()
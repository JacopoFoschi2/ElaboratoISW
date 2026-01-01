import { createDB } from "./seeding-steps/database";
import { seedGames } from "./seeding-steps/games";
import { connection } from "./utils/connection";

async function main() {
    await createDB();
    const conn = connection;
    await seedGames(conn);
    conn.end();
}

main()
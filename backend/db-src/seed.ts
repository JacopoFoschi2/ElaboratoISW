import { createDB } from "./seeding-steps/database";
import { seedGames } from "./seeding-steps/games";

async function main() {
    await createDB();
    await seedGames();
}

main()
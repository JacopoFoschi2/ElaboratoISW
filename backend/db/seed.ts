import { createDB } from "./seeding-steps/database";
import { seedGames } from "./seeding-steps/games";

createDB();
seedGames();
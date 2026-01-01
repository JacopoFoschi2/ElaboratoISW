import { createDB } from "./seeding-steps/database";
import { seedGames } from "./seeding-steps/games";
import { seedUsers } from "./seeding-steps/users";
import { seedCategories } from "./seeding-steps/categories";
import { seedComments } from "./seeding-steps/comments"
import { seedReviews } from "./seeding-steps/reviews"
import { seedOwned } from "./seeding-steps/owned";
import { seedWishlist } from "./seeding-steps/wishlist";
import { connection } from "./utils/connection";

async function main() {
    await createDB();
    const conn = connection;
    await seedGames(conn);
    await seedUsers(conn);
    await seedCategories(conn);
    await seedOwned(conn);
    await seedWishlist(conn);
    await seedReviews(conn);
    await seedComments(conn);
    console.log("Database seeding completed.");
    conn.end();
}

main()
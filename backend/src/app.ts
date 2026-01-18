import "dotenv/config";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { type Express } from "express";
import authRouter from "./routes/authentication-router";
import forumRouter from "./routes/forum-router";
import gamesRouter from "./routes/games-router";
import gameCategoriesRouter from "./routes/game-categories-router";
import usersRouter from "./routes/users-router";
import reviewsRouter from "./routes/reviews-router";
import ownedRouter from "./routes/owned-router";
import wishlistRouter from "./routes/wishlist-router";
import categoriesRouter from "./routes/categories-router";
import history from "connect-history-api-fallback";

const app: Express = express();
const port: number = 3000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(authRouter);
app.use(forumRouter);
app.use(gamesRouter);
app.use(gameCategoriesRouter);
app.use(usersRouter);
app.use(reviewsRouter);
app.use(ownedRouter);
app.use(wishlistRouter);
app.use(categoriesRouter);
app.use(history());

app.use(function (req, res, next) {
  res.setHeader("Content-Type", "text/plain");
  res.status(404).send("Page not found");
});

app.listen(port, function () {
  console.log(`Listening on http://localhost:${port}`);
});

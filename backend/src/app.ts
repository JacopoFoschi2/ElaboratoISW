import express, { type Express } from "express";
import forumRouter from "./routes/forum-router";
import gamesRouter from "./routes/games-router";
import usersRouter from "./routes/users-router";
import reviewsRouter from "./routes/reviews-router";

const app: Express = express();
const port: number = 3000;

app.use(forumRouter);
app.use(gamesRouter);
app.use(usersRouter);
app.use(reviewsRouter);

app.use(function(req, res, next) {
  res.setHeader("Content-Type", "text/plain")
  res.status(404).send("Page not found")
})

app.listen(port, function() {
  console.log(`Listening on http://localhost:${port}`)
})
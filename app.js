require("dotenv").config();

const express = require("express");

const { validateMovie } = require("./validators.js");
const { validateUser } = require("./userValidators.js");
const {
  hashPassword,
  verifyPassword,
  verifyToken,
  checkUser,
} = require("./auth.js");
const movieHandlers = require("./movieHandlers");
const usersHandlers = require("./usersHandlers");

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

const youCan = (req, res) => {
  res.send(
    "You can GET /movies, /movies/:id, /users & /users/:id. If you're login, you can POST, PUT or DELETE /movies"
  );
};

app.get("/", welcome);
app.get("/api", youCan);

app.post(
  "/api/login",
  usersHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", usersHandlers.getUsers);
app.get("/api/users/:id", usersHandlers.getUsersById);
app.post("/api/users", validateUser, hashPassword, usersHandlers.postUser);

app.use(verifyToken);

app.post("/api/movies", validateMovie, movieHandlers.postMovie);
app.put("/api/movies/:id", validateMovie, movieHandlers.updateMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);

app.put(
  "/api/users/:id",
  checkUser,
  validateUser,
  hashPassword,
  usersHandlers.updateUser
);
app.delete("/api/users/:id", checkUser, usersHandlers.deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});

const database = require("./database.js");

const getMovies = (req, res) => {
  let sql = "select * from movies";
  let sqlValue = [];
  if (req.query.color) {
    sql.match(/where/)
      ? (sql += " and color = ?")
      : (sql += " where color = ?");
    sqlValue.push(req.query.color);
  }
  if (req.query.max_duration) {
    sql.match(/where/)
      ? (sql += " and duration <= ?")
      : (sql += " where duration <= ?");
    sqlValue.push(req.query.max_duration);
  }
  database
    .query(sql, sqlValue)
    .then(([movies]) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("select * from movies where id = ?", [id])
    .then(([movie]) => {
      if (movie[0]) {
        res.json(movie[0]);
      } else {
        res.status(404).send("Navré, nous n'avons pas cette référence.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const postMovie = (req, res) => {
  const { title, director, year, color, duration } = req.body;
  database

    .query(
      "INSERT INTO movies (title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
      [title, director, year, color, duration]
    )
    .then(([result]) => {
      res.location(`/api/movies/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the movie");
    });
};

const updateMovie = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, director, year, color, duration } = req.body;
  database
    .query(
      "UPDATE movies SET title = ?, director = ?, year = ?, color = ?, duration = ?  WHERE id = ?",
      [title, director, year, color, duration, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Navré, nous n'avons pas cette référence.");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error editing the movie");
    });
};

const deleteMovie = (req, res) => {
  const id = parseInt(req.params.id);
  database
    .query("DELETE FROM movies WHERE id = ?", [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Navré, nous n'avons pas cette référence.");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error deleting the movie");
    });
};

module.exports = {
  getMovies,
  getMovieById,
  postMovie,
  updateMovie,
  deleteMovie,
};

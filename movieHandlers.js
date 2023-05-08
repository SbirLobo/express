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

const getUsers = (req, res) => {
  let sql = "select * from users";
  let sqlValue = [];
  if (req.query.language) {
    sql.match(/where/)
      ? (sql += " and language = ?")
      : (sql += " where language = ?");
    sqlValue.push(req.query.language);
  }
  if (req.query.city) {
    sql.match(/where/) ? (sql += " and city = ?") : (sql += " where city = ?");
    sqlValue.push(req.query.city);
  }
  database
    .query(sql, sqlValue)
    .then(([users]) => res.status(200).json(users))
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getUsersById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("select * from users where id = ?", [id])
    .then(([user]) => {
      if (user[0]) {
        res.status(200).json(user[0]);
      } else {
        res
          .status(404)
          .send(
            "Cet identifiant n'est pas attribué, prenez-le et rejoignez nous."
          );
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

const postUser = (req, res) => {
  const { firstname, lastname, email, city, language } = req.body;
  database
    .query(
      "INSERT INTO users (firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [firstname, lastname, email, city, language]
    )
    .then(([result]) => {
      res.location(`/api/users/${result.insertId}`).sendStatus(201);
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

const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { firstname, lastname, email, city, language } = req.body;
  database
    .query(
      "UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ? WHERE id = ?",
      [firstname, lastname, email, city, language, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res
          .status(404)
          .send(
            "Cet identifiant n'est pas attribué, prenez-le et rejoignez nous."
          );
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error editing the user");
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

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);
  database
    .query("DELETE FROM users WHERE id = ?", [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res
          .status(404)
          .send(
            "Cet identifiant n'est pas attribué, prenez-le et rejoignez nous."
          );
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error deleting the user");
    });
};

module.exports = {
  getMovies,
  getMovieById,
  getUsers,
  getUsersById,
  postMovie,
  postUser,
  updateMovie,
  updateUser,
  deleteMovie,
  deleteUser,
};

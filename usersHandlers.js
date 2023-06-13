const database = require("./database.js");

const getUsers = (req, res) => {
  let sql = "select id, firstname, lastname, email, city, language from users";
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
    .query(
      "select id, firstname, lastname, email, city, language from users where id = ?",
      [id]
    )
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

const postUser = (req, res) => {
  const { firstname, lastname, email, city, language, hashedPassword } =
    req.body;
  database
    .query(
      "INSERT INTO users (firstname, lastname, email, city, language , hashedPassword) VALUES (?, ?, ?, ?, ?, ?)",
      [firstname, lastname, email, city, language, hashedPassword]
    )
    .then(([result]) => {
      res.location(`/api/users/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the user");
    });
};

const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { firstname, lastname, email, city, language, hashedPassword } =
    req.body;
  database
    .query(
      "UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ?, hashedPassword = ? WHERE id = ?",
      [firstname, lastname, email, city, language, hashedPassword, id]
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
  getUsers,
  getUsersById,
  postUser,
  updateUser,
  deleteUser,
};

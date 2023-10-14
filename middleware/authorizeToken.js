const jwt = require("jsonwebtoken");
const knex = require("knex")(require("../knexfile"));
require("dotenv").config();

function authorizeToken(req, res, next) {
  const token = req.headers.authorization.substring(7);

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    knex("users")
      .select("id")
      .where("email", user.email)
      .first()
      .then((userId) => {
        if (!userId) {
          return res.status(403).json({ error: "User not found!" });
        }

        req.userId = userId.id;

        next();
      });
  });
}

module.exports = authorizeToken;

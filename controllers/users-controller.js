const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const knex = require("knex")(require("../knexfile"));
require("dotenv").config();

const signUpUser = (req, res) => {
  const { email, password } = req.body;

  knex("users")
    .where({ email })
    .first()
    .then((existingUser) => {
      if (existingUser) {
        return res.status(409).json({ error: "User already exists" });
      }

      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: "Password hashing failed" });
        }

        knex("users")
          .insert({
            email,
            password: hashedPassword,
          })
          .then(() => {
            const token = jwt.sign({ email }, process.env.SECRET);
            return res.json({ success: true, token });
          })
          .catch((err) => {
            return res.status(500).json({ error: "User registration failed" });
          });
      });
    })
    .catch((err) => {
      res.status(500).json({ error: "User lookup failed" });
    });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  knex("users")
    .where({ email })
    .first()
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Authentication failed" });
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign({ email }, process.env.SECRET);
          res.status(200).json({ success: "Authentication successful", token });
        } else {
          res.status(401).json({ error: "Authentication failed" });
        }
      });
    })
    .catch((err) => {
      res.status(500).json({ error: "Authentication failed" });
    });
};

module.exports = {
  signUpUser,
  loginUser,
};

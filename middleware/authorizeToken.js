const jwt = require("jsonwebtoken");
require("dotenv").config();

function authorizeToken(req, res, next) {
  const token = req.headers.authorization.substring(7);
  console.log(token);
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    next();
  });
}

module.exports = authorizeToken;

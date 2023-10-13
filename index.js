const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 8080;

const authorizeToken = require("./middleware/authorizeToken");
const usersRoutes = require("./routes/users");
const profileRoutes = require("./routes/profile");
const requestsRoutes = require("./routes/requests");

app.use(express.json());
app.use(cors());

/////////////////////
///   ENDPOINTS   ///
/////////////////////

app.get("/", (_req, res) => res.status(200).send("TEST"));
app.use("/users", usersRoutes);
app.use("/profile", profileRoutes);
app.use("/requests", requestsRoutes);

// Run the server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

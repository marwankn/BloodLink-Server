const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 8080;

const authorizeToken = require("./middleware/authorizeToken");
const usersRoutes = require("./routes/users");
const profileRoutes = require("./routes/profile");
const requestsRoutes = require("./routes/requests");
const donationRoutes = require("./routes/donations");

app.use(express.json());
app.use(cors());

/////////////////////
///   ENDPOINTS   ///
/////////////////////

app.use("/users", usersRoutes);
app.use("/profile", authorizeToken, profileRoutes);
app.use("/requests", authorizeToken, requestsRoutes);
app.use("/donations", authorizeToken, donationRoutes);

// Run the server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

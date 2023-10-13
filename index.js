const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 8080;

// Run the server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

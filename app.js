// * Package imports
const express = require("express");
const app = express();
require("dotenv").config();

// * Module imports
const userRoutes = require("./src/routes/userRoutes");

// * global settings
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/users", userRoutes);
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

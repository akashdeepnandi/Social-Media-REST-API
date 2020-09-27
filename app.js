// * Package imports
const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");

// * Module imports
const userRoutes = require("./src/routes/userRoutes");

// * global settings
const port = process.env.PORT;
app.use(express.json());

// * connect to database
const connectDB = async () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  };
  try {
    await mongoose.connect(process.env.DB_URI, options);
    console.log("MongoDB connected");
  } catch (err) {
    console.log(err);
  }
};

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/users", userRoutes);
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

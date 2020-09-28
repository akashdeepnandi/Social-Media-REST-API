// * Package imports
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");

// * Module imports
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");

// * global settings
const port = process.env.PORT;
app.use(express.json());
app.use(cookieParser())

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
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)

  // handle CSRF token errors here
  res.status(403).json({
		errors: [
			{
				msg: "Invalid CSRF Token",
				param: "csrf"
			}
		]
	})
})
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

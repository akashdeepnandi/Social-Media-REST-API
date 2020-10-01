// * Package imports
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

// * Module imports
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const postRoutes = require("./src/routes/postRoutes");
const { routeNotFound } = require("./src/middleware/appMiddleware");

// * global settings and middleware
const port = process.env.PORT;
// app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

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
app.use("/posts", postRoutes);

app.use(function (err, req, res, next) {
  if (err.code !== "EBADCSRFTOKEN") return next(err);

  // handle CSRF token errors here
  res.status(403).json({
    errors: [
      {
        msg: "Invalid CSRF Token",
        param: "csrf",
      },
    ],
  });
});
app.post("/file-upload", (req, res) => {
  try {
    if (!req.files) {
      res.json({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let image = req.files.image;

      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      image.mv("./uploads/" + image.name);

      //send response
      res.json(image);
    }
  } catch (err) {
    res.status(500).json({
      errors: [
        {
          msg: "Internal Server Error",
          param: "server",
        },
      ],
    });
  }
});
app.get('/upload/:filename', (req, res) => {
	res.sendFile(`${__dirname}/uploads/${req.params.filename}`);
})
app.use(routeNotFound);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

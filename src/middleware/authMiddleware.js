const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
require("dotenv").config();

exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) console.log(err.message);
      console.log(decodedToken);
      next();
    });
  } else {
    res.status(401).json({
      errors: [
        {
          msg: "Not logged in",
          param: "auth",
        },
      ],
    });
  }
};

exports.getCurrentUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        const user = await UserModel.findById(decodedToken);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

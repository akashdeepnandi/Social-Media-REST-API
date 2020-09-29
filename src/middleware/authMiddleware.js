const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
require("dotenv").config();

exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) console.log(err.message);
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
    jwt.verify(token, process.env.JWT_SECRET, async (err, { id }) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
				const user = await UserModel.findById(id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

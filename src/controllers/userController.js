const { validationResult } = require("express-validator");
const UserModel = require("../models/UserModel");
const { createToken, MAX_AGE } = require("../utils/utils");
const getUsers = (req, res) => {
  res.send("Hellos");
};

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { firstName, lastName, email, _id } = await UserModel.create(
      req.body
    );
    const token = await createToken(_id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: MAX_AGE * 1000 });
    res.status(201).json({ firstName, lastName, email, token });
  } catch (err) {
    if (err.code === 11000)
      res.status(409).json({
        errors: [
          {
            msg: "User already exists",
            param: "email",
          },
        ],
      });
  }
};

module.exports = {
  getUsers,
  registerUser,
};

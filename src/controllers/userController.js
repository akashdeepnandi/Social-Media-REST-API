const { validationResult } = require("express-validator");
const UserModel = require("../models/UserModel");
const getUsers = (req, res) => {
  res.send("Hellos");
};

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
		const user = await UserModel.create(req.body);
		res.status(201).json(user)
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getUsers,
  registerUser,
};

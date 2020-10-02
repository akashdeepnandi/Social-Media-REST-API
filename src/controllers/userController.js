const { validationResult } = require("express-validator");
const UserModel = require("../models/UserModel");
const { createToken } = require("../utils/utils");

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await UserModel.create(req.body);
    await createToken(user._id, res);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    if (err.code === 11000)
      return res.status(409).json({
        errors: [
          {
            msg: "User already exists",
            param: "email",
          },
        ],
      });
    res.status(500).json({
      errors: [
        {
          msg: "Internal Server Error",
          param: "server",
        },
      ],
    });
  }
};

module.exports = {
  registerUser,
};

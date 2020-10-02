const { validationResult } = require("express-validator");
const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { createToken } = require("../utils/utils");

const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user)
      return res.status(404).json({
        errors: [
          {
            msg: "User does not exist, create an account",
            param: "email",
          },
        ],
      });
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return res.status(400).json({
        errors: [
          {
            msg: "Invalid Credentials",
            param: "login",
          },
        ],
      });
    }

    await createToken(user._id, res);
    res.json(user);
  } catch (err) {
		console.log(err)
    res.status(500).json({
      errors: [
        {
          msg: "Interval server error",
          param: "server",
        },
      ],
    });
  }
};

module.exports = {
  loginUser,
};

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
		await createToken(_id, res);
    res.status(201).json({ firstName, lastName, email });
  } catch (err) {
		console.error(err)
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
					param: "server"
				}
			]
		})
  }
};

module.exports = {
  getUsers,
  registerUser,
};

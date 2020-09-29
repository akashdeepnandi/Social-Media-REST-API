const jwt = require("jsonwebtoken");
require("dotenv").config();
const MAX_AGE = 3 * 24 * 60 * 60;

const createToken = async (id, res) => {
  const token = await jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: MAX_AGE
	});
	res.cookie("jwt", token, { httpOnly: true, maxAge: MAX_AGE * 1000 });
};

module.exports = {
	createToken,
	MAX_AGE
}
const jwt = require("jsonwebtoken");
require("dotenv").config();
const MAX_AGE = 3 * 24 * 60 * 60;

const createToken = async (id) => {
  const token = await jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: MAX_AGE
	});
  return token;
};

module.exports = {
	createToken,
	MAX_AGE
}
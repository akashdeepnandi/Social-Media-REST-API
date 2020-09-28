const { validationResult } = require('express-validator');

const loginUser = async (req, res) => {
	const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
	}
  res.json(req.cookies.jwt);
};

module.exports = {
	loginUser
}

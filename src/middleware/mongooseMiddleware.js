const {
	Types: {
		ObjectId
	}
} = require('mongoose');

exports.checkObjectId = (param) => (req, res, next) => {
	if (!ObjectId.isValid(req.params[param]))
    return res.status(400).json({
			errors: [
				{
					msg: "Profile not found",
					param: "profile"
				}
			]
		});
  next();
}
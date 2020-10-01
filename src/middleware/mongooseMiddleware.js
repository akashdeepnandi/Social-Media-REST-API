const {
	Types: {
		ObjectId
	}
} = require('mongoose');

exports.checkObjectId = (param, route) => (req, res, next) => {
	if (!ObjectId.isValid(req.params[param]))
    return res.status(400).json({
			errors: [
				{
					msg: route.charAt(0).toUpperCase() + route.slice(1) + " not found",
					param: route
				}
			]
		});
  next();
}
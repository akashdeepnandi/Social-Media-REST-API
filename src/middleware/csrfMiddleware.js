const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });
const csrfMiddleware = (req, res, next) => {
	res.cookie("XSRF-TOKEN", req.csrfToken());
	res.json({});
};

module.exports = {
  csrfMiddleware,
  csrfProtection,
};

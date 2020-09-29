const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });
const csrfMiddleware = (req, res, next) => {
	res.cookie("XSRF-TOKEN", req.csrfToken());
	next();
};

module.exports = {
  csrfMiddleware,
  csrfProtection,
};

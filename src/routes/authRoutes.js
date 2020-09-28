const { Router } = require("express");
const { body } = require("express-validator");
const { loginUser } = require("../controllers/authController");
const router = Router();
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true })

router.get('/login', csrfProtection, (req, res) => {
	res.cookie('XSRF-TOKEN', req.csrfToken());
	res.json({})
})

// * authenticate user
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email is required"),
		body("password").notEmpty().withMessage("Password is required"),
		csrfProtection
  ],
  loginUser
);

module.exports = router;

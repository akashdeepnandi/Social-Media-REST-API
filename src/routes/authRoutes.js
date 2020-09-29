const { Router } = require("express");
const { body } = require("express-validator");
const { loginUser } = require("../controllers/authController");
const {
  csrfProtection,
  csrfMiddleware,
} = require("../middleware/csrfMiddleware");
const router = Router();

router.get("/login", [csrfProtection, csrfMiddleware], (req, res) => {
  res.json({});
});

// * authenticate user
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    csrfProtection,
  ],
  loginUser
);

module.exports = router;

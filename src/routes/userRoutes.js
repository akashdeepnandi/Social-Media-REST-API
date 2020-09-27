const { body } = require("express-validator");

const { Router } = require("express");
const router = Router();
const { getUsers, registerUser } = require("../controllers/userController");

router.get("/", getUsers);

router.post(
  "/register",
  [
		body("firstName").notEmpty().withMessage("First Name is required"),
		body("lastName").notEmpty().withMessage("Last Name is required"),
    body("email").isEmail().withMessage("Must be an email"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Must be at least 5 chars long"),
  ],
  registerUser
);

module.exports = router;

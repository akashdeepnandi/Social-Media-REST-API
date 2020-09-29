const { Router } = require("express");
const {
  createProfile,
  findUserProfile,
} = require("../controllers/profileController");
const { requireAuth, getCurrentUser } = require("../middleware/authMiddleware");
const { body } = require("express-validator");
const {
  csrfProtection,
  csrfMiddleware,
} = require("../middleware/csrfMiddleware");
const router = Router();

router.get("/create-profile", [csrfProtection, csrfMiddleware], (req, res) => {
  res.json({});
});

router.post(
  "/",
  [
    requireAuth,
    getCurrentUser,
    body("about").notEmpty().withMessage("About is required"),
		body("birthDate").notEmpty().withMessage("Birth Date is required"),
		csrfProtection
  ],
  createProfile
);

router.get("/", [requireAuth, getCurrentUser], findUserProfile);

module.exports = router;

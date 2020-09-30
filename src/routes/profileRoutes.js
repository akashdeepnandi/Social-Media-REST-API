const { Router } = require("express");
const {
  createProfile,
	findUserProfile,
	findUserProfileById
} = require("../controllers/profileController");
const { requireAuth, getCurrentUser } = require("../middleware/authMiddleware");
const { body } = require("express-validator");
const {
  csrfProtection,
  csrfMiddleware,
} = require("../middleware/csrfMiddleware");
const { checkObjectId } = require("../middleware/mongooseMiddleware");
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

router.get("/:user_id", [requireAuth, checkObjectId('user_id')],findUserProfileById)

module.exports = router;

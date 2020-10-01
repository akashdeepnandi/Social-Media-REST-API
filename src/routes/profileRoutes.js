const { Router } = require("express");
const {
  createProfile,
  findUserProfile,
  findUserProfileById,
  editProfile,
  getAllProfiles,
	deleteProfile,
	sendProfileImage
} = require("../controllers/profileController");
const { requireAuth, getCurrentUser } = require("../middleware/authMiddleware");
const { body } = require("express-validator");
const {
  csrfProtection,
  csrfMiddleware,
} = require("../middleware/csrfMiddleware");
const { checkObjectId } = require("../middleware/mongooseMiddleware");
const router = Router();

// * get csrf token for register profile
router.get("/create", [csrfProtection, csrfMiddleware]);
// * get csrf token for edit profile
router.get("/edit", [csrfProtection, csrfMiddleware]);

// * create profile
router.post(
  "/",
  [
    requireAuth,
    getCurrentUser,
    body("about").notEmpty().withMessage("About is required"),
    body("birthDate").notEmpty().withMessage("Birth Date is required"),
    csrfProtection,
  ],
  createProfile
);

// * find logged in user profile
router.get("/", [requireAuth, getCurrentUser], findUserProfile);
// * get all profiles
router.get("/all-profiles", requireAuth, getAllProfiles);

// * edit profile
router.put(
  "/",
  [
    requireAuth,
    getCurrentUser,
    csrfProtection,
    body("about").notEmpty().withMessage("About is required"),
    body("birthDate").notEmpty().withMessage("Birth Date is required"),
  ],
  editProfile
);

// * get user profile by id
router.get(
  "/:user_id",
  [requireAuth, checkObjectId("user_id", "profile")],
  findUserProfileById
);

router.delete('/', [requireAuth, getCurrentUser], deleteProfile);

router.get('/image/:name', sendProfileImage)

module.exports = router;

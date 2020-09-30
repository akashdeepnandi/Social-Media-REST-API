const { Router } = require("express");
const {
  createProfile,
  findUserProfile,
  findUserProfileById,
  editProfile,
  getAllProfiles,
	deleteProfile,
} = require("../controllers/profileController");
const { requireAuth, getCurrentUser } = require("../middleware/authMiddleware");
const { body } = require("express-validator");
const {
  csrfProtection,
  csrfMiddleware,
} = require("../middleware/csrfMiddleware");
const { checkObjectId } = require("../middleware/mongooseMiddleware");
const router = Router();

router.get("/create", [csrfProtection, csrfMiddleware]);
router.get("/edit", [csrfProtection, csrfMiddleware]);

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

router.get("/", [requireAuth, getCurrentUser], findUserProfile);
router.get("/all-profiles", requireAuth, getAllProfiles);

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
router.get(
  "/:user_id",
  [requireAuth, checkObjectId("user_id")],
  findUserProfileById
);

router.delete('/', [requireAuth, getCurrentUser], deleteProfile);

module.exports = router;

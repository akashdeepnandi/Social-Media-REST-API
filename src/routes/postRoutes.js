const { Router } = require("express");

const router = Router();
const { requireAuth, getCurrentUser } = require("../middleware/authMiddleware");
const { body } = require("express-validator");
const {
  csrfProtection,
  csrfMiddleware,
} = require("../middleware/csrfMiddleware");
const { createPost } = require("../controllers/postController");

router.get("/create", [csrfProtection, csrfMiddleware]);

router.post(
  "/",
  [
    requireAuth,
    getCurrentUser,
    csrfProtection,
    body("title").notEmpty().withMessage("Title of the post is required"),
    body("body").notEmpty().withMessage("Body of the post is required"),
  ],
  createPost
);

module.exports = router;

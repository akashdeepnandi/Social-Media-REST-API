const { Router } = require("express");

const router = Router();
const { requireAuth, getCurrentUser } = require("../middleware/authMiddleware");
const { body } = require("express-validator");
const {
  csrfProtection,
  csrfMiddleware,
} = require("../middleware/csrfMiddleware");
const {
  createPost,
  editPost,
  getAllPosts,
  deletePost,
} = require("../controllers/postController");
const { checkObjectId } = require("../middleware/mongooseMiddleware");

router.get("/", requireAuth, getAllPosts);

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

router.get("/edit", [csrfProtection, csrfMiddleware]);

router.put(
  "/:post_id",
  [
    checkObjectId("post_id", "post"),
    requireAuth,
    getCurrentUser,
    csrfProtection,
    body("title").notEmpty().withMessage("Title of the post is required"),
    body("body").notEmpty().withMessage("Body of the post is required"),
  ],
  editPost
);

router.delete(
  "/:post_id",
  [checkObjectId("post_id", "post"), requireAuth, getCurrentUser],
  deletePost
);

module.exports = router;

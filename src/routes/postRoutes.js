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
  addComment,
  deleteComment,
  addLike,
  deleteLike,
  sendPostImage,
  findPostById,
} = require("../controllers/postController");
const { checkObjectId } = require("../middleware/mongooseMiddleware");

router.get("/", requireAuth, getAllPosts);

router.get("/create", [requireAuth, csrfProtection, csrfMiddleware]);

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

router.get("/edit", [requireAuth, csrfProtection, csrfMiddleware]);

router.get(
  "/:post_id",
  [requireAuth, checkObjectId("post_id", "post")],
  findPostById
);

router.put(
  "/:post_id",
  [
    requireAuth,
    checkObjectId("post_id", "post"),
    getCurrentUser,
    csrfProtection,
    body("title").notEmpty().withMessage("Title of the post is required"),
    body("body").notEmpty().withMessage("Body of the post is required"),
  ],
  editPost
);

router.delete(
  "/:post_id",
  [requireAuth, checkObjectId("post_id", "post"), getCurrentUser],
  deletePost
);

router.post(
  "/comment/:post_id",
  [
    requireAuth,
    getCurrentUser,
    checkObjectId("post_id", "post"),
    body("body").notEmpty().withMessage("Body of the comment is required"),
  ],
  addComment
);

router.delete(
  "/comment/:post_id/:comment_id",
  [
    requireAuth,
    checkObjectId("post_id", "post"),
    checkObjectId("comment_id", "comment"),
    getCurrentUser,
  ],
  deleteComment
);

router.post(
  "/like/:post_id",
  [requireAuth, getCurrentUser, checkObjectId("post_id", "post")],
  addLike
);

router.delete(
  "/like/:post_id/:like_id",
  [
    requireAuth,
    checkObjectId("post_id", "post"),
    checkObjectId("like_id", "like"),
    getCurrentUser,
  ],
  deleteLike
);

router.get("/images/:name", sendPostImage);

module.exports = router;

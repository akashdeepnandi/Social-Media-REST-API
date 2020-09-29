const { Router } = require("express");
const { createPost } = require("../controllers/profileController");
const { requireAuth, getCurrentUser } = require("../middleware/authMiddleware");
const { body } = require("express-validator");

const router = Router();

router.post("/", [
	requireAuth,
	getCurrentUser
], createPost);

module.exports = router;

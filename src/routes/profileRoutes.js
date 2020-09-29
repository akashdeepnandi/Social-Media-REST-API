const { Router } = require("express");
const { createPost } = require("../controllers/profileController");
const { requireAuth } = require("../middleware/authMiddleware");
const { body } = require("express-validator");

const router = Router();

router.post("/", [
	requireAuth,
], createPost);

module.exports = router;

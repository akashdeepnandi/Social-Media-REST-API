const { Router } = require("express");
const { createPost } = require("../controllers/profileController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = Router();

router.post('/', requireAuth, createPost);

module.exports = router;
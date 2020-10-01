const { Router } = require("express");

const router = Router();
const { requireAuth, getCurrentUser } = require("../middleware/authMiddleware");
const { body } = require("express-validator");
const {
  csrfProtection,
  csrfMiddleware,
} = require("../middleware/csrfMiddleware");
const {
	createPost
} = require('../controllers/postController');


router.get('/create', [csrfProtection, csrfMiddleware]);

router.post('/', [requireAuth, getCurrentUser, csrfProtection], createPost);

module.exports = router;
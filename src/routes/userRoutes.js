const { Router } = require("express");
const router = Router();
const { getUsers } = require("../controllers/userController");

router.get("/", getUsers);

module.exports = router;

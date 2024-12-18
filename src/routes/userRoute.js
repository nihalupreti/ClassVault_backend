const express = require("express");

const { signinUser } = require("../controllers/userController");
const { signupUser } = require("../controllers/userController");

const router = express.Router();

router.post("/signin", signinUser);
router.post("/signup", signupUser);

module.exports = router;

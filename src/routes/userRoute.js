const express = require("express");

const { signinUser, signupUser } = require("../controllers/userController");

const router = express.Router();

router.post("/signin", signinUser);
router.post("/signup", signupUser);

module.exports = router;

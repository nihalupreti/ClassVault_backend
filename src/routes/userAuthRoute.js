const express = require("express");

const { signinUser, signupUser } = require("../controllers/userController");
const { isEmailNcits, accountExists } = require("../middlewares/accountExists");

const router = express.Router();

router.post("/signin", isEmailNcits, signinUser);
router.post("/signup", isEmailNcits, accountExists, signupUser);

module.exports = router;

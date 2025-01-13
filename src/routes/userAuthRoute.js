const express = require("express");

const {
  signinUser,
  signupUser,
  getUserCourses,
  getUserInfo,
  logoutUser,

} = require("../controllers/userController");
const { isEmailNcits, accountExists } = require("../middlewares/accountExists");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/signin", isEmailNcits, signinUser);
router.post("/signup", isEmailNcits, accountExists, signupUser);
router.get("/course", auth, getUserCourses);
router.get("/", auth, getUserInfo);
router.post("/logout", logoutUser);


module.exports = router;
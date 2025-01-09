const express = require("express");

const {
  createGroup,
  getGroup,
  joinGroup,
  hasUserJoined,
} = require("../controllers/groupController");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/register", auth, createGroup);
router.get("/", auth, getGroup);
router.post("/join", auth, joinGroup);
router.get("/:id", auth, hasUserJoined);

module.exports = router;

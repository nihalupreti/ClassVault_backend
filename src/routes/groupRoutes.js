const express = require("express");

const {
  createGroup,
  getGroup,
  joinGroup,
  hasUserJoined,
  getGroupMessage,
} = require("../controllers/groupController");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/register", auth, createGroup);
router.get("/", auth, getGroup);
router.post("/join", auth, joinGroup);
router.get("/:id", auth, hasUserJoined);
router.get("/message/:groupId", auth, getGroupMessage);

module.exports = router;

const express = require("express");

const {
  addResource,
  getResources,
} = require("../controllers/resourceController");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/resource/:id", auth, getResources);
router.post("/resource/:id", auth, addResource);

module.exports = router;

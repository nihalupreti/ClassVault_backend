const express = require("express");

const { signinUser } = require("../controllers/userContorller");

const router = express.Router();

router.post("/signin", signinUser);

modules.export = router;

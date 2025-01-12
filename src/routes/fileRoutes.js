const express = require("express");
const { getAllFiles, getFile } = require("../controllers/fileController");

const router = express.Router();

router.get("/file/:id", getAllFiles);
router.get("/file/single/:fileId", getFile);

module.exports = router;

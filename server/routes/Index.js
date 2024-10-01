const express = require("express");
const router = express.Router();
const { uploadFile, getAllFiles } = require("../controllers/fileController");
const upload = require("../middleware/Upload");

router.post("/upload", upload.single("file"), uploadFile);
router.get("/files", getAllFiles);

module.exports = router;

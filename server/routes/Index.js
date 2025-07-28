const express = require("express");
const path = require("path");
const router = express.Router();
const { uploadFile, getAllFiles, getFilesCount, printFiles } = require("../controllers/fileController");
const upload = require("../middleware/FileUpload");
const fs = require('fs');

// Create uploads folder if not exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

router.post('/upload', upload, uploadFile);
router.get("/files", getAllFiles);
router.get("/files/count", getFilesCount);
router.post("/print", printFiles);

module.exports = router;
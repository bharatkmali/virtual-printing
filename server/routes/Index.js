const express = require("express");
const multer = require("multer");
const router = express.Router();
const { uploadFile, getAllFiles, getFilesCount } = require("../controllers/fileController");
// const upload = require("../middleware/Upload");
// Set up Multer for file uploads
const storage = multer.memoryStorage(); // Store file in memory buffer
const upload = multer({ storage });

router.post("/upload", upload.single("filesUploads"), uploadFile);
router.get("/files", getAllFiles);
router.get("/files/count", getFilesCount);

module.exports = router;
const File = require("../models/FileModels");
const { getPDFPageCount } = require("../utils/pdfUtils");

const uploadFile = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files were uploaded." });
    }

    const savedFiles = await Promise.all(
      req.files.map(async (file) => {
        const { originalname, mimetype, path, size } = file;
        let pageCount = null;
        if (mimetype === 'application/pdf') {
          pageCount = await getPDFPageCount(path);
        }
        const newFile = new File({
          filename: originalname,
          contentType: mimetype,
          path,
          size,
          pageCount,
        });
        return await newFile.save();
      })
    );

    res.status(201).json({ 
      message: "Files uploaded successfully", 
      files: savedFiles 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllFiles = async (req, res) => {
  try {
    const files = await File.find();
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFilesCount = async (req, res) => {
  try {
    const count = await File.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadFile, getAllFiles, getFilesCount };

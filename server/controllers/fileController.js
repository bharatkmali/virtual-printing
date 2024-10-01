const File = require("../models/FileModels");

const uploadFile = async (req, res) => {
  try {
    const { originalname, mimetype, path, size } = req.file;

    const file = new File({
      filename: originalname,
      contentType: mimetype,
      path,
      size,
    });

    await file.save();
    res.status(201).json({ message: "File uploaded successfully", file });
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

module.exports = { uploadFile, getAllFiles };

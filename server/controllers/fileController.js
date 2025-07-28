const File = require("../models/FileModels");
const { getPDFPageCount } = require("../utils/pdfUtils");
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs').promises;

const uploadFile = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files were uploaded." });
    }

    const savedFiles = await Promise.all(
      req.files.map(async (file) => {
        try {
          const { originalname, mimetype, path: filePath, size } = file;
          
          // Calculate page count for PDFs and images
          let pageCount = 1; // Default for images
          if (mimetype === 'application/pdf') {
            try {
              pageCount = await getPDFPageCount(filePath);
            } catch (err) {
              console.error(`Error counting PDF pages for ${originalname}:`, err);
              pageCount = null;
            }
          }

          const newFile = new File({
            filename: originalname,
            contentType: mimetype,
            path: filePath,
            size,
            pageCount,
            status: 'uploaded'
          });

          return await newFile.save();
        } catch (err) {
          console.error(`Error processing file ${file.originalname}:`, err);
          throw err;
        }
      })
    );

    res.status(201).json({ 
      message: "Files uploaded successfully", 
      files: savedFiles.map(file => ({
        id: file._id,
        filename: file.filename,
        contentType: file.contentType,
        size: file.size,
        pageCount: file.pageCount
      }))
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ 
      message: "Error uploading files",
      error: error.message 
    });
  }
};

const getAllFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ _id: -1 }); // Most recent first
    res.status(200).json(files.map(file => ({
      id: file._id,
      filename: file.filename,
      contentType: file.contentType,
      size: file.size,
      pageCount: file.pageCount,
      createdAt: file._id.getTimestamp(),
      status: file.status
    })));
  } catch (error) {
    console.error("Get files error:", error);
    res.status(500).json({ 
      message: "Error retrieving files",
      error: error.message 
    });
  }
};

const getFilesCount = async (req, res) => {
  try {
    const count = await File.countDocuments();
    const totalPages = await File.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $ifNull: ["$pageCount", 1] } }
        }
      }
    ]);
    
    res.status(200).json({ 
      count,
      totalPages: totalPages[0]?.total || 0
    });
  } catch (error) {
    console.error("Get files count error:", error);
    res.status(500).json({ 
      message: "Error counting files",
      error: error.message 
    });
  }
};

const printFiles = async (req, res) => {
  try {
    const { fileIds } = req.body;
    
    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({ message: "No files selected for printing" });
    }

    const files = await File.find({ _id: { $in: fileIds } });
    
    if (files.length === 0) {
      return res.status(404).json({ message: "No files found" });
    }

    // Print each file
    for (const file of files) {
      try {
        // Update file status to 'printing'
        file.status = 'printing';
        await file.save();

        // Use lp command for UNIX-like systems or print command for Windows
        const isWindows = process.platform === 'win32';
        const printCommand = isWindows ? 'print' : 'lp';
        const printArgs = isWindows ? [file.path] : ['-d', 'default_printer', file.path];

        await new Promise((resolve, reject) => {
          const printProcess = spawn(printCommand, printArgs);

          printProcess.on('error', (error) => {
            console.error(`Print process error for ${file.filename}:`, error);
            reject(error);
          });

          printProcess.on('close', (code) => {
            if (code === 0) {
              resolve();
            } else {
              reject(new Error(`Print process exited with code ${code}`));
            }
          });
        });

        // Update file status to 'printed'
        file.status = 'printed';
        await file.save();
      } catch (error) {
        console.error(`Error printing file ${file.filename}:`, error);
        file.status = 'error';
        await file.save();
        throw error;
      }
    }

    res.status(200).json({ 
      message: "Files sent to printer successfully",
      printedFiles: files.map(file => ({
        id: file._id,
        filename: file.filename,
        status: file.status
      }))
    });
  } catch (error) {
    console.error("Print error:", error);
    res.status(500).json({ 
      message: "Error printing files",
      error: error.message 
    });
  }
};

module.exports = { uploadFile, getAllFiles, getFilesCount, printFiles };

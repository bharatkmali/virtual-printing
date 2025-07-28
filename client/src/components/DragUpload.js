import React, { useState } from "react";
import { getPDFPageCount } from '../utils/pdfUtils';

export const DragUpload = (props) => {
  const { handleUploadFile,pageCount,setPageCount,setSelectedFiles,selectedFiles } = props;
 
  const [previewUrls, setPreviewUrls] = useState([]);


  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setSelectedFiles(files);
      
      // Count pages for PDF files
      let totalPages = 0;
      for (const file of files) {
        console.log("file", file)
        if (file.type.startsWith('image/')) {
          totalPages++;
        }
        if (file.type === 'application/pdf') {
          const pages = await getPDFPageCount(file);
          if (pages) {
            totalPages += pages;
          }
        }
      }
      setPageCount(totalPages);
      
      const urls = files.map(file => {
        if (file.type.startsWith('image/')) {
          return URL.createObjectURL(file);
        }
        return null;
      });
      setPreviewUrls(urls);
      console.log("files", files)
      // Create FormData and append all files
      const formData = new FormData();
      files.forEach(file => {
        console.log("file", file)
        formData.append('files', file);
      });
      console.log("formData", formData)
      
      handleUploadFile(formData);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              {pageCount > 0 && <span className="block">Total PDF Pages: {pageCount}</span>}
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOC, DOCX, or images (JPG, PNG, GIF)</p>
          </div>
          <input id="dropzone-file" type="file" multiple className="hidden" onChange={handleFileChange} />
        </label>
      </div>
      
      {selectedFiles.length > 0 && (
        <div className="mt-4 p-4 border rounded-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <h3 className="text-lg font-semibold mb-2 col-span-full">Selected Files:</h3>
          {selectedFiles.map((file, index) => (
            <div key={index} className="border p-3 rounded">
              {previewUrls[index] ? (
                <img src={previewUrls[index]} alt={`Preview ${index + 1}`} className="max-w-xs max-h-48 object-contain mb-2" />
              ) : (
                <div className="flex items-center space-x-2">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-gray-600">{file.name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
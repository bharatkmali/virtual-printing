import React, { useEffect, useState } from "react";
import { DragUpload } from "../components/DragUpload";
import { uploadFile, getFiles, printFiles } from "../services/FileService";

const PRICE_PER_PAGE = 2.00; // ₹5 per page

const Home = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printSuccess, setPrintSuccess] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const data = await getFiles();
      setFileList(data);
    } catch (err) {
      setError("Failed to fetch files");
      console.error(err);
    }
  };

  const handleUploadFile = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await uploadFile(formData);
      if (response && response.data) {
        setUploadedFiles(response.data.files);
        await fetchFiles();
      }
    } catch (err) {
      setError("Failed to upload files");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    try {
      setIsPrinting(true);
      setError(null);
      setPrintSuccess(false);

      const fileIds = uploadedFiles.map(file => file.id);
      await printFiles(fileIds);
      
      setPrintSuccess(true);
      setSelectedFiles([]);
      setPageCount(0);
      setUploadedFiles([]);
      
      // Refresh the file list after printing
      await fetchFiles();
    } catch (err) {
      setError("Failed to print files");
      console.error(err);
    } finally {
      setIsPrinting(false);
    }
  };

  const totalAmount = pageCount * PRICE_PER_PAGE;

  // Function to format amount in Indian style (with thousands separators)
  const formatIndianPrice = (amount) => {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return formatter.format(amount);
  };

  return (
    <div className="justify-center flex p-12 align-middle flex-col text-center gap-4 max-w-4xl mx-auto">
      <h1 className="font-bold text-2xl">Upload Files For Print</h1>
      
      <div className="mt-4 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="grid grid-cols-2 gap-4 text-left">
          <div className="text-gray-600">Total Pages:</div>
          <div className="text-right font-semibold">{pageCount}</div>
          <div className="text-gray-600">Price per Page:</div>
          <div className="text-right font-semibold">{formatIndianPrice(PRICE_PER_PAGE)}</div>
          <div className="text-gray-600 text-lg pt-2 border-t">Total Amount:</div>
          <div className="text-right font-bold text-lg text-blue-600 pt-2 border-t">
            {formatIndianPrice(totalAmount)}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {printSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">Files sent to printer successfully!</span>
        </div>
      )}

      <DragUpload
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        handleUploadFile={handleUploadFile}
        setPageCount={setPageCount}
        pageCount={pageCount}
      />

      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <button
            onClick={handlePrint}
            disabled={isPrinting || loading}
            className={`w-full py-3 px-6 text-white font-semibold rounded-lg shadow-md ${
              isPrinting || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
            }`}
          >
            {isPrinting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Printing...
              </span>
            ) : (
              `Print Files - ${formatIndianPrice(totalAmount)}`
            )}
          </button>
        </div>
      )}

      {fileList && fileList.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Print History</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fileList.map((file, index) => (
              <div key={index} className="border p-4 rounded-lg shadow">
                <p className="font-semibold">{file.filename}</p>
                <p className="text-sm text-gray-500">Size: {(file.size / 1024).toFixed(2)} KB</p>
                {file.pageCount && (
                  <>
                    <p className="text-sm text-gray-500">Pages: {file.pageCount}</p>
                    <p className="text-sm text-gray-500">
                      Amount: {formatIndianPrice(file.pageCount * PRICE_PER_PAGE)}
                    </p>
                  </>
                )}
                <p className="text-sm text-gray-500">
                  Printed: {new Date(file.createdAt).toLocaleDateString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {(loading || isPrinting) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default Home;

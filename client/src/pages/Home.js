import React, { useEffect, useState } from "react";

import { DragUpload } from "../components/DragUpload";
import { uploadFile, getFiles } from "../services/FileService";
const Home = () => {
  const [state, setState] = useState({
    name: "",
    files: null,
    previewSrc: "",
    uploadStatus: "",
  });
  const [fileList, setFileList] = useState();
  const [pageCount, setPageCount] = useState(0);
  const [refreshCount, setRefreshCount] = useState(0);
console.log("fileList",fileList)
 
  const handleUploadFile = async (files) => {
    console.log(files)
    const file = files[0];
    if (file) {
      setState((prevState) => ({ ...prevState, files: file }));
      // File preview
      const reader = new FileReader();
      reader.onload = () => setState((prevState) => ({ ...prevState, previewSrc: reader.result }));
      reader.readAsDataURL(file);
    }
  };
  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", state?.files);
    // await uploadFile(formData);
    setRefreshCount(prev => prev + 1);
    // window.location.reload();
  };
  return (
    <>
      <div className="justify-center flex p-12 align-middle flex-col text-center gap-4">
        <text className="font-bold text-xl">Upload File For Print</text>
        <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-lg font-semibold">Total Pages</h2>
      <p className="text-3xl font-bold text-blue-600">{pageCount}</p>
      {pageCount>0 && <p className="text-sm text-gray-500">Total Amount = <span className="text-3xl font-bold text-blue-600">{pageCount* 2.5}</span></p>}
    </div>
        <form onSubmit={handleFileUpload} enctype="multipart/form-data">
          <DragUpload handleUploadFile={handleUploadFile} setPageCount={setPageCount} pageCount={pageCount}/>
          <button className="bg-slate-500 mt-4 p-4" type="submit">
            Upload submit
          </button>
        </form>

      </div>
    </>
  );
};

export default Home;

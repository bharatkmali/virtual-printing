import React, { useEffect, useState } from "react";
import FileCount from "../components/FileCount";
import { DragUpload } from "../components/DragUpload";
import { uploadFile, getFiles } from "../services/FileService";
const Home = () => {
  const [state, setState] = useState({
    name: "",
    files: null,
    previewSrc: "",
    uploadStatus: "",
  });
  const [fileList, setFileList] = useState([]);
  const [refreshCount, setRefreshCount] = useState(0);
console.log("fileList",fileList)
  // useEffect(() => {
  //   const fetchFiles = async () => {
  //     const files = await getFiles();
  //     setFileList(files);
  //   };
  //   fetchFiles();
  // }, []);
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
        <FileCount refreshTrigger={refreshCount} />
        <form onSubmit={handleFileUpload} enctype="multipart/form-data">
          <DragUpload handleUploadFile={handleUploadFile} setFileList={setFileList} />
          <button className="bg-slate-500 mt-4 p-4" type="submit">
            Upload submit
          </button>
        </form>

      </div>
    </>
  );
};

export default Home;

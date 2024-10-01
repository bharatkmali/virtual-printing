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
  const [fileList, setFileList] = useState([]);

  // useEffect(() => {
  //   const fetchFiles = async () => {
  //     const files = await getFiles();
  //     setFileList(files);
  //   };
  //   fetchFiles();
  // }, []);
  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("e", e);
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
    await uploadFile(formData);
    window.location.reload();
  };
  return (
    <>
      <div className="justify-center flex p-12 align-middle flex-col text-center gap-4">
        <text className="font-bold text-xl">Upload File For Print</text>
        <form onSubmit={handleFileUpload}>
          <DragUpload handleUploadFile={handleUploadFile} />
          <button className="bg-slate-500 mt-4 p-4" type="submit">
            Upload submitfe
          </button>
        </form>

        {state?.previewSrc && (
          <div>
            <h3>Preview:</h3>
            <img src={state?.previewSrc} alt="preview" style={{ maxWidth: "300px" }} />
          </div>
        )}
        <p>{state?.uploadStatus}</p>

        <h2>Uploaded Files</h2>
        <ul>
          {fileList.map((file) => (
            <li key={file._id}>
              <a href={`http://localhost:5000${file.filepath}`} target="_blank" rel="noopener noreferrer">
                {file.filename}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Home;

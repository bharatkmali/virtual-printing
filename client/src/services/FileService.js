import axios from "axios";

export const uploadFile = async (formData) => {
  console.log("formData----->",formData)
  const config = { headers: { "Content-Type": "multipart/form-data" } };
  try {
    const res= await axios.post("http://localhost:8080/upload", formData, config);
    console.log("res",res)
    return res;
  } catch (error) {
    console.log("error", error);
  }
};

export const getFiles = async () => {
  try {
    const { data } = await axios.get("http://localhost:8080/files");
    return data;
  } catch (error) {
    console.log("error", error);
  }
};


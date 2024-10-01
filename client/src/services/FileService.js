import axios from "axios";

export const uploadFile = async (formData) => {
  const config = { headers: { "Content-Type": "multipart/form-data" } };
  try {
    const { data } = await axios.post("http://localhost:5000/api/files/upload", formData, config);
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const getFiles = async () => {
  try {
    const { data } = await axios.get("http://localhost:5000/api/files/files");
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

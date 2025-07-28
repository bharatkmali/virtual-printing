import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const uploadFile = async (formData) => {
  try {
    const response = await api.post("/upload", formData);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to upload files");
    }
    throw new Error("Network error occurred");
  }
};

export const getFiles = async () => {
  try {
    const response = await api.get("/files", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch files");
    }
    throw new Error("Network error occurred");
  }
};

export const printFiles = async (fileIds) => {
  try {
    const response = await api.post("/print", { fileIds }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to print files");
    }
    throw new Error("Network error occurred");
  }
};


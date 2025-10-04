import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:4000/api/v1/demo", // Add http://
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;

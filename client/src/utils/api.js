import axios from "axios";

const api = axios.create({
  baseURL: "https://mood-diary-1-3ma9.onrender.com",
  withCredentials: true,
});

export default api;

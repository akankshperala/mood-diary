import axios from "axios";

const api = axios.create({
  baseURL: "https://mood-diary-3.onrender.com/api",
  // withCredentials: true,
});

export default api;

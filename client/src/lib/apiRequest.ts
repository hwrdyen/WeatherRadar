import axios from "axios";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const apiRequest = axios.create({
  baseURL: API_BASE_URL,
});

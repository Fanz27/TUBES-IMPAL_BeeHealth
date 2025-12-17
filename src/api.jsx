import axios from "axios"
const NGROK_URL = 'https://numbers-subessential-inarguably.ngrok-free.dev';
export const API_URL = `${NGROK_URL}/api`;
const token = localStorage.getItem("AuthToken");

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("AuthToken"); // ⬅ AMBIL TERBARU
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export default api; 
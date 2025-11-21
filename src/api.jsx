import axios from "axios"
const NGROK_URL = 'https://numbers-subessential-inarguably.ngrok-free.dev';
export const API_URL = `${NGROK_URL}/api`;
const token = localStorage.getItem("AuthToken");

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  withCredentials: true,
});
export default api; 
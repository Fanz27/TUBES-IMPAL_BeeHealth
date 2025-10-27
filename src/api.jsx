import axios from "axios"
const NGROK_URL = 'https://leonor-unvended-gynodioeciously.ngrok-free.dev';
export const API_URL = `${NGROK_URL}/api/auth`;

const api = axios.create({
  baseURL: NGROK_URL,
  headers: {
    'ngrok-skip-browser-warning': 'true'
  }
});

import axios from 'axios';

const API_BASE_URL = 'https://numbers-subessential-inarguably.ngrok-free.dev';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export default api;
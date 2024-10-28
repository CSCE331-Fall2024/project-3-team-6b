// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://your-api-url.com', // Replace with your actual API URL
  timeout: 1000,
});

export default api;

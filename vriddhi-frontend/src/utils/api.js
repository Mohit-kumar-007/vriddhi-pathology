import axios from 'axios';

let baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

// Normalize URL: Auto-append '/api' if backend URL is provided without it
if (baseUrl.startsWith('http') && !baseUrl.includes('/api')) {
  baseUrl = baseUrl.replace(/\/$/, '') + '/api';
}

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject token if logged in
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vriddhi_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

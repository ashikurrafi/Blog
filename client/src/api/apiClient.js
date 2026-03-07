import axios from 'axios';
import store from '../redux/store';

const apiClient = axios.create({
  baseURL: 'http://localhost:4000/api/v1/demo',
  // baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api/v1/demo',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ──── Request interceptor: auto-attach Bearer token ────
apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Let axios set Content-Type automatically for FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ──── Response interceptor: normalize errors ────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  },
);

export default apiClient;

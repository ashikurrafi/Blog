import axios from 'axios';
import { setToken, setUser } from '../redux/authSlice';
import store from '../redux/store';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1/demo',
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

// ──── Response interceptor: handle errors and auth ────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - clear auth state
    if (error.response?.status === 401) {
      store.dispatch(setToken(null));
      store.dispatch(setUser(null));
    }

    // Return error with response attached for proper handling
    return Promise.reject(error);
  },
);

export default apiClient;

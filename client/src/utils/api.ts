import axios from "axios";
import { clearStoredAuth, getStoredToken, getValidStoredToken } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getValidStoredToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const hadToken = Boolean(getStoredToken());
    if (error.response?.status === 401 && hadToken) {
      clearStoredAuth();

      if (!["/login", "/register"].includes(window.location.pathname)) {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;

import axios from "axios";
import { getToken, clearToken } from "./auth";

// The ONE shared Axios instance. Every API call in the app goes through this.
const api = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 15000,
});

// Re-export so other files can tell "request was cancelled" apart from a real error
export const isCancel = axios.isCancel;

// Request interceptor: attach the login token to every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: handle errors in one place
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Cancelled requests (used later for search) are not failures: pass through untouched
    if (axios.isCancel(error)) return Promise.reject(error);

    const status = error.response?.status ?? null;

    // Expired/invalid token while logged in: clear it and send the user to login
    if (status === 401 && getToken()) {
      clearToken();
      window.location.href = "/login";
    }

    // Turn every failure into a plain Error with a readable message + status
    let message = "Something went wrong. Please try again.";
    if (error.response?.data?.message) message = error.response.data.message;
    else if (error.code === "ECONNABORTED") message = "The request timed out. Please try again.";
    else if (!error.response) message = "Network error. Check your connection and try again.";

    const friendly = new Error(message);
    friendly.status = status;
    return Promise.reject(friendly);
  }
);

export default api;

import axios from "axios";

const isProduction = process.env.NODE_ENV === "production";

let API_BASE_URL;
if (isProduction) {
  API_BASE_URL = process.env.NEXT_PUBLIC_REMOTE_BACKEND_API_URL;
} else {
  API_BASE_URL =
    process.env.NEXT_PUBLIC_LOCAL_BACKEND_API_URL || "http://localhost:4501";
}

export { API_BASE_URL };

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from "axios";

const api = axios.create({
  baseURL: "http://3.120.39.1:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("Current token:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Added Authorization header:", config.headers.Authorization);
  } else {
    console.log("No token found in localStorage");
  }
  return config;
});

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(
      "API Response:",
      response.config.url,
      response.status,
      response.data
    );
    return response;
  },
  (error) => {
    console.error(
      "API Error:",
      error.config?.url,
      error.response?.status,
      error.response?.data
    );
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

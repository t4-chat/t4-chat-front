import axios, { type AxiosInstance } from "axios";
import { tokenService } from "~/openapi/requests/core/OpenAPI";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenService.removeToken();
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export { api };

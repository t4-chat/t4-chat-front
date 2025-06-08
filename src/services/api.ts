import axios, { AxiosInstance } from 'axios';
import { tokenService } from 'src/services/tokenService';

const API_URL = process.env.REACT_APP_API_URL;

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenService.removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { api }; 
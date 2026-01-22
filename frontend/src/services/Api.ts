import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '../stores/auth';

const createApi = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: '', 
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        const authStore = useAuthStore();
        authStore.setLogout(); 
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default createApi;
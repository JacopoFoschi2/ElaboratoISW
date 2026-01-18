import axios, { AxiosInstance } from 'axios';


const createApi = (): AxiosInstance => {
  return axios.create({
    baseURL: 'http://localhost:3000/',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export default createApi;
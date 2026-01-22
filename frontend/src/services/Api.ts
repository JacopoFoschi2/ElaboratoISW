import axios, { AxiosInstance } from 'axios';


const createApi = (): AxiosInstance => {
  return axios.create({
    baseURL: '',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export default createApi;
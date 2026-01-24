import api from './Api';
import type { User } from '../types';

export const AuthenticationService = {
  login(email: string, password: string) {
    return api.post('/auth/login', { email, password });
  },

  logout() {
    return api.post('/auth/logout');
  },

  getProfile() {
    return api.get<User | null>('/auth/profile');
  },

  register(username: string, email: string, password: string) {
    return api.post('/auth/register', {
      username,
      email,
      password,
    });
  },
};
export default AuthenticationService;

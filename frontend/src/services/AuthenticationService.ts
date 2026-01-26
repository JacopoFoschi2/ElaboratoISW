import api from './Api';
import type { User } from '../types';

interface ExistsResponse {
  exists: boolean;
}

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
  checkUsername(username: string) {
    return api.get<{ exists: boolean }>(
      `/auth/username-exists/${username}`
    );
  },

  checkEmail(email: string) {
    return api.get<{ exists: boolean }>(
      `/auth/email-exists/${email}`
    );
  },
  changePassword(payload: { currentPassword: string; password: string }) {
    return api.put('/auth/change-password', payload);
  },


};
export default AuthenticationService;

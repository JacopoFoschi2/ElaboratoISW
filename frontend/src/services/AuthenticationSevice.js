import Api from './Api';

export default {
  register(credentials) {
    return Api().post('register', credentials);
  },
  login(credentials) {
    return Api().post('login', credentials);
  },
  resetPassword(credentials) {
    return Api().post('reset-password', credentials);
  }
};
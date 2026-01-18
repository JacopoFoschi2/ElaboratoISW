import Api from './Api';

export default {
    // Create
    register(credentials) {
        return Api().post('/api/auth/register', credentials);
    },
    // Read
    getProfile() {
        return Api().get('/api/auth/profile');
    },
    checkUsername(username) {
        return Api().get(`/api/users/exists/username/${username}`);
    },
    checkEmail(email) {
        return Api().get(`/api/users/exists/email/${email}`);
    },
    // Update
    changePassword(data) {
        return Api().post('/api/auth/change-password', data);
    },
    // Login/Logout
    login(credentials) {
        return Api().post('/api/auth/login', credentials);
    },
    logout() {
        return Api().post('/api/auth/logout');
    }
};
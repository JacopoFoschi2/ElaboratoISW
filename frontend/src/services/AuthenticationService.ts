import { AxiosResponse } from 'axios';
import Api from './Api';

interface Credentials {
    username: string;
    email: string;
    password: string;
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface PasswordChangeData {
    oldPassword?: string;
    newPassword: string;
}

interface User {
    user: User;
    id: number;
    username: string;
    token: string;
}

export default {
    // Create
    register(credentials: Credentials): Promise<AxiosResponse> {
        return Api().post('/api/auth/register', credentials);
    },

    // Read
    getProfile(): Promise<AxiosResponse> {
        return Api().get('/api/auth/profile');
    },

    getUserData(): Promise<AxiosResponse> {
        return Api().get('/api/user');
    },

    checkUsername(username: string): Promise<AxiosResponse> {
        return Api().get(`/api/auth/username-exists/${username}`);
    },

    checkEmail(email: string): Promise<AxiosResponse> {
        return Api().get(`/api/auth/email-exists/${email}`);
    },

    // Update
    changePassword(data: PasswordChangeData): Promise<AxiosResponse> {
        return Api().post('/api/auth/change-password', data);
    },

    login(credentials: LoginCredentials): Promise<AxiosResponse<User>> {
        return Api().post<User>('/api/auth/login', credentials);
    },

    logout(): Promise<AxiosResponse> {
        return Api().post('/api/auth/logout');
    }
};
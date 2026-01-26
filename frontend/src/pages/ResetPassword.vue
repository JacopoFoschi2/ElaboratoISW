<script setup lang="ts">
import { ref } from 'vue';
import AuthenticationService from '../services/AuthenticationService';

interface ChangePasswordPayload {
    currentPassword: string;
    password: string;
}


interface AuthError {
    response?: {
        data?: {
            error?: string;
        };
    };
}

const currentPassword = ref<string>('');
const newPassword = ref<string>('');
const confirmPassword = ref<string>('');
const message = ref<string>('');
const isError = ref<boolean>(false);

const handleChangePassword = async (): Promise<void> => {
    // Reset status
    message.value = '';
    isError.value = false;

    // Validation
    if (!currentPassword.value || !newPassword.value) {
        isError.value = true;
        message.value = "Please fill in all required fields!";
        return;
    }

    if (newPassword.value !== confirmPassword.value) {
        isError.value = true;
        message.value = "New passwords do not match!";
        return;
    }

    try {
        const payload: ChangePasswordPayload = {
            currentPassword: currentPassword.value,
            password: newPassword.value
        };

        await AuthenticationService.changePassword(payload);
        message.value = "Password changed successfully!";
        currentPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';
        

    } catch (err: any) {
        isError.value = true;
        message.value =
            err.response?.data || "Error: the current password is incorrect.";
    }

};
</script>

<template>
    <div class="reset-password-page">
        <h2>Change Password</h2>

        <div class="form-container">
            <h3>Update your security</h3>

            <input v-model="currentPassword" type="password" placeholder="Current Password" required />
            <hr class="separator" />
            <input v-model="newPassword" type="password" placeholder="New Password" required />
            <input v-model="confirmPassword" type="password" placeholder="Confirm New Password" required />

            <button @click="handleChangePassword">Update Password</button>

            <p v-if="message" :class="{ 'error-msg': isError, 'success-msg': !isError }">
                {{ message }}
            </p>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "../styles/style-variables.scss" as style-variables;

.reset-password-page {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.separator {
    width: 250px;
    margin: 10px 0 20px 0;
    border: 0;
    border-top: 1px solid #eee;
}

h2 {
    font-size: 3rem;
    margin-top: 40px;
}

h3 {
    font-size: 1.5rem;
    margin: 20px 0;
}

input {
    padding: 10px;
    font-size: 1rem;
    margin-bottom: 15px;
    width: 250px;
    border: 1px solid style-variables.$default-text-color;
}

button {
    padding: 10px 20px;
    font-size: 1rem;
    background-color: style-variables.$default-navbar-color;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: style-variables.$button-and-border-footer-color;
        color: style-variables.$default-text-color;
    }
}

.error-msg {
    color: red;
    margin-top: 15px;
    font-weight: bold;
}

.success-msg {
    color: style-variables.$default-text-color;
    margin-top: 15px;
    font-weight: bold;
}
</style>
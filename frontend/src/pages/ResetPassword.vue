<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const message = ref('');
const isError = ref(false);

const handleResetPassword = async () => {
    message.value = '';
    isError.value = false;

    if (!email.value || !password.value) {
        isError.value = true;
        message.value = "Please fill in all required fields!";
        return;
    }

    if (password.value !== confirmPassword.value) {
        isError.value = true;
        message.value = "Passwords do not match!";
        return;
    }

    try {
        await AuthenticationService.changePassword({
            currentPassword: currentPassword.value,
            newPassword: password.value
        });
        message.value = "Password changed successfully!";
    } catch (err) {
        isError.value = true;
        message.value = "Error: the current password is incorrect.";
    }
};
</script>

<template>
    <div class="reset-password-page">
        <h2>Reset Password</h2>

        <div class="form-container">
            <h3>Enter your details</h3>

            <input v-model="email" type="email" placeholder="Your Email" required />

            <input v-model="password" type="password" placeholder="New Password" required />

            <input v-model="confirmPassword" type="password" placeholder="Confirm New Password" required />

            <button @click="handleResetPassword">Reset Password</button>

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
    color: black;
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
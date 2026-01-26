<script setup lang="ts">
import { ref } from 'vue';
import AuthenticationService from '../services/AuthenticationService';
import { useRouter } from 'vue-router';
interface ExistsResponse {
    exists: boolean;
}

const username = ref<string>('');
const email = ref<string>('');
const password = ref<string>('');
const confirmPassword = ref<string>('');
const acceptTerms = ref<boolean>(false);

const message = ref<string>('');
const isError = ref<boolean>(false);
const router = useRouter();

const handleRegister = async (): Promise<void> => {
    message.value = '';
    isError.value = false;

    // Basic validation
    if (!username.value || !email.value || !password.value) {
        isError.value = true;
        message.value = "All fields are required!";
        return;
    }

    if (password.value !== confirmPassword.value) {
        isError.value = true;
        message.value = "Passwords do not match!";
        return;
    }

    if (!acceptTerms.value) {
        isError.value = true;
        message.value = "You must accept the Terms and Conditions.";
        return;
    }

    try {
        //Check if Username exists (/api/auth/username-exists/:username)
        const userCheck = await AuthenticationService.checkUsername(username.value) as { data: ExistsResponse };
        if (userCheck.data.exists) {
            isError.value = true;
            message.value = "Username is already taken.";
            return;
        }

        //Check if Email exists (/api/auth/email-exists/:email)
        const emailCheck = await AuthenticationService.checkEmail(email.value) as { data: ExistsResponse };
        if (emailCheck.data.exists) {
            isError.value = true;
            message.value = "Email already registered.";
            return;
        }

        //Register (/api/auth/register)
        await AuthenticationService.register(
            username.value,
            email.value,
            password.value
        );

        message.value = "Account created successfully!";
        setTimeout(() => router.push('/'), 2000);

    } catch (err: any) {
        isError.value = true;
        message.value = err.response?.data?.error || "Registration failed.";
    }
};
</script>

<template>
    <div class="register-page">
        <h2>Create Account</h2>
        <div class="form-container">
            <h3>Join our community</h3>

            <input v-model="username" type="text" placeholder="Username" required />
            <input v-model="email" type="email" placeholder="Email Address" required />
            <input v-model="password" type="password" placeholder="Password" required />
            <input v-model="confirmPassword" type="password" placeholder="Confirm Password" required />

            <div class="terms-container">
                <input type="checkbox" id="terms" v-model="acceptTerms" required />
                <label for="terms">I agree to the Terms & Conditions</label>
            </div>

            <button @click="handleRegister">Sign Up</button>

            <p v-if="message" :class="{ 'error-msg': isError, 'success-msg': !isError }">
                {{ message }}
            </p>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "../styles/style-variables.scss" as style-variables;

.register-page {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
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

input[type="text"],
input[type="email"],
input[type="password"] {
    padding: 10px;
    font-size: 1rem;
    margin-bottom: 15px;
    width: 280px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.terms-container {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;

    label {
        color: style-variables.$default-text-color;
    }
}

button {
    padding: 12px 30px;
    font-size: 1rem;
    background-color: style-variables.$default-navbar-color;
    cursor: pointer;
    transition: all 0.3s ease;

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
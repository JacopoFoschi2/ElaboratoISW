<script setup>
import { ref } from 'vue';
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const acceptTerms = ref(false);

const message = ref('');
const isError = ref(false);

const handleRegister = async () => {
    // Reset status
    message.value = '';
    isError.value = false;

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
        // Example API call logic:
        // await axios.post('/api/register', { 
        //    username: username.value, 
        //    email: email.value, 
        //    password: password.value 
        // });

        console.log("Registering user:", { 
            username: username.value, 
            email: email.value 
        });

        message.value = "Account created successfully! Redirecting...";
        isError.value = false;
        
    } catch (err) {
        isError.value = true;
        message.value = "Registration failed. Please try again.";
    }
};
</script>

<template>
    <div class="register-page">
        <h2>Create Account</h2>

        <div class="form-container">
            <h3>Join our community</h3>

            <input 
                v-model="username" 
                type="text" 
                placeholder="Username" 
                required
            />

            <input 
                v-model="email" 
                type="email" 
                placeholder="Email Address" 
                required
            />

            <input 
                v-model="password" 
                type="password" 
                placeholder="Password" 
                required    
            />

            <input 
                v-model="confirmPassword" 
                type="password" 
                placeholder="Confirm Password" 
                required    
            />

            <div class="terms-container">
                <input 
                    type="checkbox" 
                    id="terms" 
                    v-model="acceptTerms"
                    required
                />
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

    input {
        width: auto;
        margin-bottom: 0;
    }

    label {
        color: style-variables.$default-text-color;
    }
}

button {
    padding: 12px 30px;
    font-size: 1rem;
    background-color: style-variables.$default-navbar-color;
    color: black;
    border: none;
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
    color: green;
    margin-top: 15px;
    font-weight: bold;
}

</style>
<script>
export default {
    name: 'App',
    data() {
        return {
            showSignIn: false,
        };
    },
    methods: {
        toggleSingIn(){
            this.showSignIn = !this.showSignIn;
        }
    }
};

    
</script>

<template>
    <nav class="navbar-everywhere">
        <ul class="nav-container">
            <li><router-link to="/"><img src="./assets/logo.svg" alt="Logo"></router-link></li>
            <li><router-link to="/forum">FORUM</router-link></li>
            <li><router-link to="/">BEST</router-link></li>
            <li><router-link to="/">RECENTLY RELEASED</router-link></li>
            <li><router-link to="/">GENRE</router-link></li>
            <li><img @click="toggleSingIn" class="pfp-" src="./assets/pfpIcon.svg" alt="User Icon"></img></li>
        </ul>
    </nav>
    <main>
        <router-view />

        <div v-if="showSignIn" class="sign-in-background">
            <div class="sign-in-container">
                <img @click="toggleSingIn" class="close-icon" src="../src/assets/xIcon.svg"/>
                <h2>SIGN IN</h2>
                <form>
                    <input type="text" placeholder="insert your email..."/>
                    <input type="password" placeholder="insert your password..."/>
                    <button type="submit">Enter</button>
                    <p>Don't have an account? <router-link to="/registration" @click="toggleSingIn">Register</router-link></p>
                </form>
            </div>
        </div>
    </main>
    <nav class="footer-everywhere">
        <ul>
            <li><router-link to="/privacy-policy">Privacy Policy</router-link></li>
            <li><router-link to="/terms-of-service">Terms of Service</router-link></li>
            <li><router-link to="/community-guidelines">Community Guidelines</router-link></li>
            <li><router-link to="/cookie-policy">Cookie Policy</router-link></li>
        </ul>
    </nav>

</template>

<style scoped lang="scss">
@use "../src/styles/style-variables.scss" as style-variables;

.navbar-everywhere {
    display: flex;
    background-color: style-variables.$default-navbar-color;
    align-items: center;
    justify-content: center;
    height: 60px;
    width: 100%;

    .nav-container {
        max-width: 1060px;
        
        display: flex;
        align-items: center;
        gap: 50px;
    }
}

ul {
    list-style: none;
    display: flex;
    gap: 20px;
    padding: 0;
    margin: 0;
    align-items: center;

    .nav-container {
        display: flex;
        align-items: center;
        gap: 20px;
        max-width: 1060px;
    }

    li {
        a {
            color: black;
        }
        a:hover {
            text-decoration: underline;
        }
    }
}

body.sign-in-background {
    overflow: hidden;
}

.sign-in-background {
    position: fixed;
    top: 0; 
    left: 0;
    width: 100%;
    height: 100%;
    background-color:rgba(0, 0, 0, 0.7);
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.sign-in-container {
    position: relative;
    background-color: style-variables.$default-background-color;
    padding: 3rem;
    text-align: center;
    color: style-variables.$default-text-color;
    width: 100%;
    max-width: 400px;
}

.sign-in-container h2 {
    font-family: "Jaidi Regular", sans-serif;
    margin-bottom: 2rem;
    font-size: 2rem;
}
.sign-in-container input {
    display: block;
    width: 100%;
    padding: 1rem;
    align-items: center;
    margin-bottom: 1rem;
    border: 1px solid style-variables.$default-text-color;
    background-color: transparent;
    color: style-variables.$default-text-color;
    font-size: 1rem;
}

.sign-in-container button {
    width: 100%;
    padding: 1rem;
    background-color: style-variables.$button-and-border-footer-color;
    color: style-variables.$default-text-color;
    border: 1px solid style-variables.$default-text-color;
    font-size: 1rem;
    cursor: pointer;
}

.sign-in-container form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.sign-in-container router-link {
    color: style-variables.$button-and-border-footer-color;
    text-decoration: underline;
}

.close-icon{
    position: absolute;
    top: 10px;
    right: 20px;
    cursor: pointer;
}
.close-icon:hover{
    border: 1px solid style-variables.$default-text-color;
}


.footer-everywhere {
    background-color: style-variables.$default-footer-color;
    height: 70px;
    border-top: 1px solid style-variables.$button-and-border-footer-color;

    ul {
        max-width: 1060px;
        margin: 0 auto;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 30px;

        li,
        a {
            color: style-variables.$default-footer-text-color;
            font-size: 18px;
            text-decoration: none;
        }
    }
}
</style>
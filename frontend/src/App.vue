<script>
import { useAuthStore } from './stores/auth';
import AuthenticationService from './services/AuthenticationService';
import { mapState, mapActions } from 'pinia';
export default {
    name: 'App',
    data() {
        return {
            showSignIn: false,
            categories: [],
            loginEmail: '',
            loginPassword: '',
            errorMessage: ''
        };
    },
    computed: {
        ...mapState(useAuthStore, ['user', 'isLoggedIn', 'token']),

        currentUserId() {
            return this.user ? this.user.id : null;
        }
    },
    methods: {
        ...mapActions(useAuthStore, ['setLogin', 'setLogout', 'setUser', 'setIsLoggedIn']),

        toggleSignIn() {
            this.showSignIn = !this.showSignIn;
            this.errorMessage = '';
        },
        handleClickpfp() {
            
            if (this.isLoggedIn) {
                this.$router.push(`/api/user`);
            } else {
                this.toggleSignIn();
            }
        },
        async handleLogin() {
            this.errorMessage = '';
            try {
                const response = await AuthenticationService.login({
                    email: this.loginEmail,
                    password: this.loginPassword
                });

                this.setLogin({
                    token: response.data.token,
                    user: response.data.user
                });

                this.showSignIn = false;
                this.$router.push('/api/user');
            } catch (error) {
                this.errorMessage = error.response?.data?.error || "Credentials not right";
            }
        },
        async handleLogout() {
            try {
                await AuthenticationService.logout();
                this.setLogout();
                this.$router.push('/');
            } catch (error) {
                this.errorMessage = "Error during logout";
                console.error("Error during logout", error);
            }
        },
        async fetchCategories() {
            try {
                const response = await fetch('/api/categories');
                const catData = await response.json();
                this.categories = catData.map(cat => ({ ...cat, games: [] }));

                for (const category of this.categories) {
                    try {
                        const gamesResponse = await fetch(`/api/games/${category.categoryId}`);
                        const gamesData = await gamesResponse.json();
                        category.games = gamesData.slice(0, 5); //only 5 per category
                    }
                    catch (error) {
                        console.error(`Error fetching games for category ${category.categoryId}:`, error);
                    }
                }
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        },
    },
    async mounted() {
        this.fetchCategories();

        if (this.token && !this.user) {
            try {
                const response = await AuthenticationService.getProfile();
                this.setUser(response.data.user);
            } catch (err) {
                this.setLogout(); 
            }
        }
    }
};

</script>

<template>
    <nav class="navbar-everywhere">
        <ul class="nav-container">
            <li><router-link to="/"><img src="./assets/logo.svg" alt="Logo"></router-link></li>
            <li><router-link to="/forum">FORUM</router-link></li>
            <li><router-link to="/best-games">BEST</router-link></li>
            <li><router-link to="/recently-released">RECENTLY RELEASED</router-link></li>

            <li class="dropdown"><router-link class="dropdown-trigger" to="/">
                    <img class="arrow-icon" src="./assets/arrowDown.svg" alt="arrow">GENRE</router-link>

                <ul class="drop-menu">
                    <li v-for="category in categories" :key="category.categoryId">
                        <router-link :to="`/category/${category.categoryId}`">
                            {{ category.categoryName }}
                        </router-link>
                    </li>
                </ul>

            </li>
            <li v-if="!isLoggedIn">
                <img @click="handleClickpfp" class="pfp-icon" src="./assets/pfpIcon.svg" alt="User Icon"></img>
            </li>
            <li v-else class="dropdown-user">
                <div class="dropdown-trigger">
                    <img class="pfp-icon" src="./assets/pfpIcon.svg" alt="User Icon"></img>
                </div>

                <ul class="drop-menu">
                    <li><router-link :to="`#`">PROFILE</router-link></li>
                    <li><router-link :to="`#`">WISHLIST</router-link></li>
                    <li><router-link :to="`#`">OWNED</router-link></li>
                    <div class="menu-divider"></div>
                    <li><a @click="handleLogout" class="logout-btn">LOGOUT</a>
                    </li>
                </ul>
            </li>
        </ul>
    </nav>
    <main>
        <router-view />

        <div v-if="showSignIn" class="sign-in-background">
            <div class="sign-in-container">
                <img @click="toggleSignIn" class="close-icon" src="../src/assets/xIcon.svg" />
                <h2>SIGN IN</h2>
                <form @submit.prevent="handleLogin">
                    <input v-model="loginEmail" type="text" placeholder="insert your email..." required="" />
                    <input v-model="loginPassword" type="password" placeholder="insert your password..." required="" />
                    <p v-if="errorMessage" class="error-message" style="color: red;">{{ errorMessage }}</p>
                    <button type="submit">Enter</button>
                    <p>Don't have an account? <router-link to="/registration"
                            @click="toggleSignIn">Register</router-link></p>
                    <p>Forgot your password? <router-link to="/reset-password" @click="toggleSignIn">Reset
                            Password</router-link></p>
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

        .menu-divider {
            height: 1px;
            width: 90%;
            background-color: style-variables.$default-text-color;
            margin: 5px 0;
        }

        .logout-btn {
            color: style-variables.$default-text-color;
            cursor: pointer;
        }

        .dropdown-user {
            position: relative;
            display: flex;
            align-items: center;
            height: 100%;

            &:hover {
                .drop-menu {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                    z-index: 2;
                }
            }

            .dropdown-trigger {
                display: flex;
                align-items: center;
                gap: 5px;

                .arrow-icon {
                    vertical-align: middle;
                }
            }
        }

        .pfp-icon {
            width: 30px;
            height: 30px;
            cursor: pointer;
        }

        .dropdown {
            position: relative;
            display: flex;
            align-items: center;
            height: 100%;

            &:hover {
                .drop-menu {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                    z-index: 2;
                }
            }

            .dropdown-trigger {
                display: flex;
                align-items: center;
                gap: 5px;

                .arrow-icon {
                    vertical-align: middle;
                }
            }
        }

        .drop-menu {
            position: absolute;
            top: 100%;
            left: 0;
            background-color: style-variables.$default-navbar-color;
            min-width: 200px;
            flex-direction: column;
            gap: 0;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
            z-index: 1;

            opacity: 0;
            visibility: hidden;
            transform: translateY(10px);
            transition: all 0.3s ease;

            li {
                width: 100%;

                a {
                    color: black;
                    padding: 10px 20px;
                    display: block;
                    text-decoration: none;
                    font-size: 14px;

                    &:hover {
                        background-color: style-variables.$button-and-border-footer-color;
                        color: style-variables.$default-text-color;
                        text-decoration: none;
                        cursor: pointer;
                    }
                }
            }
        }

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
    background-color: rgba(0, 0, 0, 0.7);
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

    .error-message {
        color: red;
        font-size: 0.9rem;
        width: 100%;
        margin-bottom: 1rem;
    }
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

.close-icon {
    position: absolute;
    top: 10px;
    right: 20px;
    cursor: pointer;
}

.close-icon:hover {
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
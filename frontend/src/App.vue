<template>
    <nav class="navbar-everywhere">
        <ul class="nav-container">
            <li><router-link to="/"><img src="./assets/logo.svg" alt="Logo"></router-link></li>
            <li><router-link to="/forum">FORUM</router-link></li>
            <li><router-link to="/">BEST</router-link></li>
            <li><router-link to="/">RECENTLY RELEASED</router-link></li>
            <li><router-link to="/">GENRE</router-link></li>
            <li><router-link to="/"><img class="pfp-" src="./assets/pfpIcon.svg" alt="User Icon">
                    </img></router-link></li>
        </ul>
    </nav>
    <main>
        <router-view />
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
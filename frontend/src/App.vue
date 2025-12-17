<template>
    <nav class="navbar-home">
        <ul>
            <div class="nav-container">
                <li class="logo-home"><router-link to="/"><img src="./assets/logo.svg" alt="Logo"></router-link></li>
                <li><router-link to="/prova">FORUM</router-link></li>
                <li><router-link to="/">BEST</router-link></li>
                <li><router-link to="/">RECENTLY RELEASED</router-link></li>
                <li><router-link to="/">GENRE</router-link></li>
                <li><router-link to="/"><img src="./assets/pfpIcon.svg" alt="User Icon"></img></router-link></li>
            </div>
        </ul>
    </nav>
    <main>
        <router-view />
    </main>
    <nav class="footer-home"></nav>

</template>

<style scoped>
    html, body {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .navbar-home{
        display: flex;
        background-color: #d9d9d9;
        align-items: center;
        justify-content: space-between;
        padding: 10px 20px;
    }

    ul{
        list-style: none;
        display: flex;
        gap: 20px;
        padding: 0;
        margin: 0;
        align-items: center;

        .nav-container{
            display: flex;
            align-items: center;
            gap: 20px;
            max-width: 1060px;
        }
        
        a{
            text-decoration: none;
            font: 1em sans-serif;
        }
    }
    .logo-home {
        font-weight: bold;
        color: #FFE001;
        background-color: black;
    }
</style>
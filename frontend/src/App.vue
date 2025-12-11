<template>
    <header>
        <h1>PCMASTERDB</h1>
    </header>
    <nav>
        <ul>
            <li class="logo-home"><router-link to="/">IMG PCMASTERRACEDB</router-link></li>
            <li><router-link to="/">FORUM</router-link></li>
            <li><router-link to="/">BEST</router-link></li>
            <li><router-link to="/">RECENTLY RELEASED</router-link></li>
            <li><router-link to="/">GENRE</router-link></li>
            <li><router-link to="/">ICON IMG</router-link></li>

        </ul>
    </nav>
    <main>
        <router-view />
    </main>
</template>

<style scoped>
    nav{
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
    }
    .logo-home {
        font-weight: bold;
        font-size: 1.8em;
        color: #FFE001;
        background-color: black;
    }
</style>
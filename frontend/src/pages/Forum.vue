<script setup>
import { ref, onMounted } from 'vue';

const forums = ref([]);

const getImageUrl = (game) => {
    try {
        if (game.gameSmallBannerBin && game.gameSmallBannerBin.data) {
            const arrayBuffer = new Uint8Array(game.gameSmallBannerBin.data);
            let binary = '';
            const bytes = new Uint8Array(arrayBuffer);
            const len = bytes.byteLength;

            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return `data:image/jpg;base64,${window.btoa(binary)}`;
        }
    }
    catch (error) {
        console.error('Error processing image:', error);
    }
    return '';
};

const fetchForums = async () => {
    try {
        const response = await fetch('/api/forums');
        const data = await response.json();
        forums.value = data;
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
};

onMounted(() => {
    fetchForums();
});
</script>

<template>
    <div class="forum-page">
        <main class="content-wrapper">
            <h2>All Forums</h2>
            <div class="search-container">
                <input type="text" placeholder="search your forums..." class="search-input" />
                <button class="search-button">
                    <img src="../assets/search.svg" alt="search icon" />
                </button>
            </div>
            
            <div v-if="forums.length" class="forum-list">
                <div v-for="forum in forums" :key="forum.gameId" class="forum-card">
                    <img class="image-forum" :src="getImageUrl(forum)" :alt="forum.gameName" />
                    <p class="game-title">{{ forum.gameName }}</p>
                </div>
            </div>
            <p v-else>Loading forums...</p>
        </main>

    </div>

</template>

<style scoped lang="scss">
@use "../styles/style-variables.scss" as style-variables;

.forum-page {
    margin: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: style-variables.$default-background-color;
    overflow-y: auto;
}

.content-wrapper {
    margin: 0 auto;
    max-width: 1200px;
    padding: 0 20px;
    padding-bottom: 3%;
    align-items: center;

    p{
        color: style-variables.$default-text-color;
        font-size: 3rem;
    }
}

h2 {
    font-size: 2.5rem;
    padding-top: 10%;
}

.search-container {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    width: 60%;
    margin: 40px auto 20px auto;
    background-color: style-variables.$default-navbar-color;

    .search-input {
        flex: 1;
        border: none;
        background-color: transparent;
        font-size: 1rem;
        outline: none;
        padding: 10px 15px;
    }


    .search-button {
        padding: 0px 15px;
        border: none;
        background-color: transparent;
        justify-content: center;
        align-items: center;
        display: flex;
        cursor: pointer;
    }
}

.forum-list {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 30px;

    .forum-card {
        display: flex;
        align-items: center;
        border: 1px solid style-variables.$default-text-color;
        background-color: transparent;
        cursor: pointer;
    }

    .image-forum {
        margin-right: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        max-width: 231px;
        max-height: 87px;
        object-fit: cover;
    }

    .game-title {
        font-size: 1.5rem;
        padding-right: 10px;
    }
}
</style>
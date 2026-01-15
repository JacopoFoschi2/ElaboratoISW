<script setup>
import { ref, onMounted } from 'vue';

const categories = ref([]);

const getImageUrl = (game) => {
    try {
        if (game.gameCoverBin && game.gameCoverBin.data) {
            const arrayBuffer = new Uint8Array(game.gameCoverBin.data);
            let binary = '';
            arrayBuffer.forEach((byte) => {
                binary += String.fromCharCode(byte);
            });
            return `data:image/jpg;base64,${window.btoa(binary)}`;
        }
    }
    catch (error) {
        console.error('Error processing image:', error);
    }
    return '';
};

const fetchCategories = async () => {
    try {
        const response = await fetch('/api/categories');
        const catData = await response.json();
        categories.value = catData.map(cat => ({ ...cat, games: [] }));

        for (const category of categories.value) {
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
};

onMounted(() => {
    fetchCategories();
});
</script>


<template>
    <div class="homepage">
        <main class="content-wrapper">
            <div class="search-container">
                <input type="text" placeholder="search your games..." class="search-input" />
                <button class="search-button">
                    <img src="../assets/search.svg" alt="search icon" />
                </button>

            </div>
            <div v-for="category in categories" :key="category.categoryId">
                <template v-if="category.games?.length > 0">
                    <h2 class="section-title">{{ category.categoryName }}</h2>
                    <div class="game-section">
                        <router-link v-for="game in category.games" :key="game.gameId"
                            :to="{ name: 'GameDetail', params: { id: game.gameId } }" 
                            class="game-card">
                            <img :src="getImageUrl(game)" :alt="game.gameName" class="game-cover-image" />
                        </router-link>
                    </div>
                </template>
            </div>
        </main>

    </div>

</template>
<script>


</script>

<style scoped lang="scss">
@use "../styles/style-variables.scss" as style-variables;

.homepage {
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

.section-title {
    padding-top: 5%;
    padding-bottom: 1%;
    font-size: 2rem;
}

.game-section {
    display: flex;
    justify-content: space-between;
    padding-bottom: 2%;
    gap: 15px;
    width: 100%;
}

.game-card {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 19.2%;
    height: auto;
    aspect-ratio: 2/3;
    object-fit: cover;
    overflow: hidden;
    transition: transform 0.3s;
    min-width: 200px;
    min-height: 342px;

    .game-cover-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .placeholder-img {
        text-align: center;
        background-color: style-variables.$default-text-color;
    }
}

.game-card:hover {
    transform: scale(1.05);
}

.loader {
    text-align: center;
    font-size: 1.5rem;
}
</style>
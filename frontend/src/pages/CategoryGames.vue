<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
    id: {
        type: Number,
        required: true
    }
});

const categoryName = ref('');
const games = ref([]);
const isLoading = ref(true);

const getImageUrl = (game) => {
    try {
        if (game.gameCoverBin && game.gameCoverBin.data) {
            const arrayBuffer = new Uint8Array(game.gameCoverBin.data);
            const blob = new Blob([arrayBuffer], { type: 'image/jpg' });
            return URL.createObjectURL(blob);
        }
        else {
            return '';
        }
    }
    catch (error) {
        console.error('Error processing image:', error);
    }
    return '';
};
const fetchData = async() => {
    isLoading.value = true;
    const categoryId = props.id;

    try {
        const categoryResponse = await fetch(`/api/categories`);
        const allCategoryData = await categoryResponse.json();
        const currentCategory = allCategoryData.find(cat => cat.categoryId === parseInt(categoryId));

        if (currentCategory) {
            categoryName.value = currentCategory.categoryName;
        } else {
            categoryName.value = 'Unknown Category';
        }

        const gamesResponse = await fetch(`/api/games/${categoryId}`);
        const gamesData = await gamesResponse.json();
        games.value = gamesData;
    } catch (error) {
        console.error('Error fetching category games:', error);
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    fetchData();
});

watch(() => props.id, () => {
    fetchData();
});
</script>

<template>
    <div class="category-page">
        <main class="content-wrapper">
            <h2 class="page-title" v-if="!isLoading">{{ categoryName }}</h2>

            <div v-if="isLoading" class="loader">Loading games...</div>
            <div v-else-if="games.length > 0" class="games-grid">
                <router-link
                    v-for="game in games"
                    :key="game.gameId"
                    :to="{ name: 'GameDetail', params: { id: game.gameId } }"
                    class="game-card"
                >
                    <img :src="getImageUrl(game)" :alt="game.gameTitle" class="game-cover" />
                </router-link>
            </div>
            <div v-else class="no-games-message">
                <p>No games found in this category.</p>
            </div>
        </main>
    </div>
</template>

<style scoped lang="scss">
@use "../styles/style-variables.scss" as style-variables;

.category-page {
    margin: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: style-variables.$default-background-color;
    overflow-y: auto;
}

.content-wrapper {
    flex-direction: column;
    display: flex;
    margin: 0 auto;
    padding: 0 20px;
    padding-bottom: 3%;
    max-width: 1200px;
    width: 100%;
}

.page-title{
    font-size: 2.5rem;
    text-transform: uppercase;
    color: style-variables.$default-text-color;
    text-align: center;
    padding-bottom: 20px;
}

.games-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: flex-start;
    width: 100%;

    .game-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: calc((100% - 80px) / 5);
        aspect-ratio: 2/3;
        overflow: hidden;
        transition: transform 0.3s;
        text-decoration: none;

        .game-cover {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        &:hover {
            transform: scale(1.05);
        }


    }
}

.loader,.no-games-message {
    text-align: center;
    font-size: 1.5rem;
    color: style-variables.$default-text-color;
    margin-top: 50px;
}
</style>
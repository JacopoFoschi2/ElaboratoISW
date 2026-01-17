<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const bestGames = ref([]);
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

const fetchBestGames = async () => {
    try {
        isLoading.value = true;
        const response = await fetch('/api/games/rating');
        const allGames = await response.json();

        bestGames.value = allGames.filter(game => 
        {
            const ratingValue = game.gameRating;
            const numericRating = Number(ratingValue);
            return !isNaN(numericRating) && Math.floor(numericRating) >= 4.0; 
        });
    }
    catch (error) {
        console.error('Error fetching best games:', error);
    }
    finally {
        isLoading.value = false;
    }

}

onMounted(() => {
    fetchBestGames();
});
</script>

<template>
    <div class="best-games-page">
        <main class="content-wrapper">
            <h2 class="page-title">The Best of the Best</h2>

            <div v-if="isLoading" class="loader">
                <p>Loading best games...</p>
            </div>

            <div v-else-if="bestGames.length > 0" class="games-grid">
                <router-link v-for="game in bestGames" :key="game.gameId" class="game-card"
                    :to="{ name: 'GameDetail', params: { id: game.gameId } }">
                    <img :src="getImageUrl(game)" :alt="game.gameName" class="game-cover" />
                </router-link>
            </div>

            <div v-else class="no-games-message">
                <p>No 5 star games found.</p>
            </div>

        </main>

    </div>
</template>

<style scoped lang="scss">
@use "../styles/style-variables.scss" as style-variables;

.best-games-page {
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
}

.page-title {
    color: style-variables.$default-text-color;
    text-align: center;
    margin: 40px 0 20px 0;
    font-size: 3rem;
}

.games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
}

.game-card{
    text-decoration: none;
    cursor: pointer;
    overflow: hidden;
    transition: transform 0.3s;

    &:hover {
        transform: scale(1.05);
    }

    .game-cover {
        width: 100%;
        object-fit: cover;
        aspect-ratio: 2/3;
    }

}

.loader,.no-games-message {
    text-align: center;
    font-size: 1.5rem;
    color: style-variables.$default-text-color;
    margin-top: 50px;
}

</style>
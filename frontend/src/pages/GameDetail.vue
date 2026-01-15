<script setup>
import { ref, onMounted } from 'vue';
import StarRating from '../components/StarRating.vue';

const props = defineProps({
    id: {
        type: Number,
        required: true
    }
});
const game = ref(null);
const loading = ref(true);

const getImageUrl = (imageBuffer) => {
    if (!imageBuffer || !imageBuffer.data) return '';
    const binary = String.fromCharCode(...imageBuffer.data);
    const base64String = window.btoa(binary);
    return `data:image/jpg;base64,${base64String}`;
};

onMounted(async () => {
    try {
        const gameId = props.id;
        const response = await fetch(`/api/game/${gameId}`);
        const data = await response.json();
        game.value = data[0];
    } catch (error) {
        console.error('There was a problem with the loading of the game:', error);
    } finally {
        loading.value = false;
    }
});

</script>
<template>
    <div v-if="!loading && game" class="game-detail-page">
        <main class="content-wrapper">
            <img :src="getImageUrl(game.gameCoverBin)" :alt="game.gameName" class="game-cover" />
            <h2 class="game-title">{{ game.gameName }}</h2>

            <StarRating :rating="game.rating" :size="30" /> <!-- this is only an example-->

            <p class="game-description">{{ game.gameDesc }}</p>

            <div class="available-container">
                <h3>Available on:</h3>
                <ul>
                    <li v-if="game.gameSteamLink">
                        <a :href="game.gameSteamLink" target="_blank">
                            <img src='../assets/availableIcons/SteamLogo.svg' alt="Steam Logo" />
                        </a>
                    </li>
                    <li v-if="game.gameGogLink">
                        <a :href="game.gameGogLink" target="_blank">
                            <img src='../assets/availableIcons/GogLogo.svg' alt="Gog Logo" />
                        </a>
                    </li>
                    <li v-if="game.gameEpicLink">
                        <a :href="game.gameEpicLink" target="_blank">
                            <img src='../assets/availableIcons/EpicLogo.svg' alt="Epic Games Logo" />
                        </a>
                    </li>
                </ul>
            </div>

        </main>

    </div>
    <div v-else>
        <p>Loading...</p>
    </div>
</template>

<style scoped lang="scss">
@use "../styles/style-variables.scss" as style-variables;

.game-detail-page {
    margin: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: style-variables.$default-background-color;
    overflow-y: auto;
}

.game-title {
    font-size: 3rem;
    color: style-variables.$default-text-color;
}

.game-description {
    font-size: 1.5rem;
    color: style-variables.$default-text-color;
}

.content-wrapper {
    margin: 0 auto;
    max-width: 1200px;
    padding: 0 20px;
    padding-bottom: 3%;
}
</style>
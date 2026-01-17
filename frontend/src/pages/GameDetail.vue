<script setup>
import { ref, onMounted } from 'vue';
import StarRating from '../components/StarRating.vue';
import moment from 'moment';

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
            <aside class="left-column">
                <img :src="getImageUrl(game.gameCoverBin)" :alt="game.gameName" class="game-cover" />

                <div class="rating-container">
                    <p class="rating-label">Rating: {{ Math.floor(game.gameRating) }} / 5</p>
                    <StarRating :rating=" Math.floor(game.gameRating)" :size="10" />
                </div>

                <h3>Available on:</h3>
                <div class="available-container">
                    <ul>
                        <li v-if="game.gameSteamLink">
                            <a :href="game.gameSteamLink" target="_blank">
                                <img src='../assets/availableIcons/SteamLogo.svg' alt="Steam Logo" />
                            </a>
                        </li>
                        <li v-if="game.gameGoGLink">
                            <a :href="game.gameGoGLink" target="_blank">
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
            </aside>

            <div class="right-column">
                <h2 class="game-title">{{ game.gameName }}</h2>


                <p class="game-release-date">{{ moment(game.gameReleaseDate).format('DD/MM/YYYY') }}</p>
                <p class="game-description">{{ game.gameDesc }}</p>


            </div>

        </main>
        <section class="review-section">
            <button class="review-btn">Write your review</button>
        </section>
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
    background-color: style-variables.$default-background-color;
    padding: 60px 20px;
    overflow-y: auto;
}

.content-wrapper {
    margin: 0 auto;
    max-width: 1200px;
    display: flex;
    padding-bottom: 3%;
    gap: 40px;
    align-items: flex-start;
}

.left-column {
    flex: 0 0 400px;

    .game-cover {
        width: 100%;
        height: auto;
    }
}

.right-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.game-title {
    font-size: 3.5rem;
    font-weight: 500;
    color: style-variables.$default-text-color;
    margin: 0;
}


.rating-container {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.5rem;
    color: style-variables.$default-text-color;

    .rating-label {
        font-weight: bold;
        font-size: 2rem;
    }
}

.game-release-date {
    font-size: 1.8rem;
    color: style-variables.$default-text-color;
    padding: 0;
    margin: 0;
}

.game-description {
    font-size: 1.5rem;
    color: style-variables.$default-text-color;
}

h3 {
    font-size: 2rem;
    color: style-variables.$default-text-color;
    margin-bottom: 10px;
}

.available-container {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px 30px;
    background-color: style-variables.$default-navbar-color;
    max-width: fit-content;


    ul {
        list-style: none;
        padding: 0;
        display: flex;
        gap: 20px;

        li img {
            width: 50px;
            height: auto;
            transition: transform 0.3s;

            &:hover {
                transform: scale(1.1);
            }
        }
    }
}

.game-description {
    font-size: 1.5rem;
    color: style-variables.$default-text-color;
    max-width: 800px;
    line-height: 1.5;
}

.review-section {
    max-width: 1200px;
    text-align: center;
    background-color: style-variables.$button-and-border-footer-color;
    border: 1px solid style-variables.$default-text-color;
    margin: 0 auto 40px auto;

    .review-btn {
        width: 100%;
        padding: 10px;
        font-size: 1.5rem;
        background: transparent;
        color: style-variables.$default-text-color;
        cursor: pointer;
        transition: background-color 0.3s;
    }
}
</style>
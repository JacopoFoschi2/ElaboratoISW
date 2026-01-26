<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

interface Game {
    gameId: number;
    gameName: string;
    gameCoverBin?: {
        data: number[];
    };
}

const router = useRouter();
const ownedGames = ref<Game[]>([]);
const createdUrls: string[] = [];

const fetchOwnedGames = async (): Promise<void> => {
    try {
        const response = await fetch('/api/owned');
        if (!response.ok) throw new Error('Failed to fetch owned games');
        ownedGames.value = await response.json();
    } catch (error) {
        console.error('Error fetching owned games:', error);
    }
};

const getImageUrl = (game: Game): string => {
    try {
        if (game.gameCoverBin?.data) {
            const arrayBuffer = new Uint8Array(game.gameCoverBin.data);
            const blob = new Blob([arrayBuffer], { type: 'image/jpg' });
            const url = URL.createObjectURL(blob);
            createdUrls.push(url);
            return url;
        }
        return '';
    } catch (error) {
        console.error('Error processing image:', error);
        return '';
    }
};

onMounted(fetchOwnedGames);

onUnmounted(() => {
    createdUrls.forEach(url => URL.revokeObjectURL(url));
});
</script>
<template>
    <div class="owned-page">
        <main class="content-wrapper">
            <h2 class="page-title">My Games</h2>

            <div v-if="ownedGames.length" class="games-grid">
                <router-link v-for="game in ownedGames" :key="game.gameId"
                    :to="{ name: 'GameDetail', params: { id: game.gameId } }" class="game-card">
                    <img :src="getImageUrl(game)" :alt="game.gameName" class="game-cover-image" />
                </router-link>
            </div>

            <p v-else class="empty-owned">
                You don't own any games yet.
            </p>
        </main>
    </div>
</template>
<style scoped lang="scss">
@use "../styles/style-variables.scss" as style-variables;

.owned-page {
    margin: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: style-variables.$default-background-color;
    overflow-y: auto;
}

.content-wrapper {
    margin: 0;
    padding: 0 50px;
    padding-bottom: 3%;
    text-align: center;
}

.page-title {
    color: style-variables.$default-text-color;
    text-align: center;
    margin: 40px 0 20px 0;
    font-size: 3rem;
    padding-bottom: 50px;
}

.games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 30px;
}

.game-card {
    text-decoration: none;
    cursor: pointer;
    overflow: hidden;
    transition: transform 0.3s;

    &:hover {
        transform: scale(1.05);
    }

    .game-cover-image {
        width: 100%;
        object-fit: cover;
        aspect-ratio: 2/3;
    }

}

.empty-owned {
    margin-top: 40px;
    text-align: center;
    font-size: 1.6rem;
}
</style>
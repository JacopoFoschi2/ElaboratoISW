<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Game {
    gameId: number;
    gameName: string;
    gameCoverBin?: {
        data: number[];
    };
}

const wishlist = ref<Game[]>([]);
const createdUrls: string[] = [];

const fetchWishlist = async (): Promise<void> => {
    try {
        const response = await fetch('/api/wishlist');
        if (!response.ok) throw new Error('Failed to fetch wishlist');
        wishlist.value = await response.json();
    } catch (error) {
        console.error('Error fetching wishlist:', error);
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

onMounted(fetchWishlist);

onUnmounted(() => {
    createdUrls.forEach(url => URL.revokeObjectURL(url));
});
</script>
<template>
    <div class="wishlist-page">
        <main class="content-wrapper">
            <h2 class="page-title">My Wishlist</h2>

            <div v-if="wishlist.length" class="games-grid">
                <router-link v-for="game in wishlist" :key="game.gameId"
                    :to="{ name: 'GameDetail', params: { id: game.gameId } }" class="game-card">
                    <img :src="getImageUrl(game)" :alt="game.gameName" class="game-cover-image" />
                </router-link>
            </div>

            <p v-else class="empty-wishlist">
                Your wishlist is empty. Start adding some games!
            </p>
        </main>
    </div>
</template>
<style scoped lang="scss">
@use "../styles/style-variables.scss" as style-variables;

.wishlist-page {
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

.game-card{
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


.empty-wishlist {
    margin-top: 40px;
    text-align: center;
    font-size: 1.6rem;
}
</style>
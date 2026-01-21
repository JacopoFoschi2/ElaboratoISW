<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Game {
  gameId: number | string;
  gameName: string;
  gameCoverBin?: {
    data: number[];
  };
  rating?: number;
}

const bestGames = ref<Game[]>([]);
const isLoading = ref<boolean>(true);

const objectUrls = new Set<string>();

const getImageUrl = (game: Game): string => {
  try {
    if (game.gameCoverBin?.data) {
      const arrayBuffer = new Uint8Array(game.gameCoverBin.data);
      const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      
      objectUrls.add(url);
      return url;
    }
  } catch (error) {
    console.error('Error processing game image:', error);
  }
  return ''; 
};

const fetchBestGames = async (): Promise<void> => {
  try {
    isLoading.value = true;
    const response = await fetch('/api/games/rating');
    
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const allGames: Game[] = await response.json();
    bestGames.value = allGames;
  } catch (error) {
    console.error('Error fetching best games:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchBestGames();
});

onUnmounted(() => {
  objectUrls.forEach(url => URL.revokeObjectURL(url));
  objectUrls.clear();
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
    margin: 0;
    padding: 0 20px;
    padding-bottom: 3%;
    text-align: center;
    justify-content: center;
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
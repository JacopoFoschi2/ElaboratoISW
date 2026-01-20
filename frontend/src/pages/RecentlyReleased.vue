<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Game {
  gameId: number | string;
  gameName: string;
  gameCoverBin?: {
    data: Uint8Array;
  };
}


const recentlyReleasedGames = ref<Game[]>([]);
const isLoading = ref<boolean>(true);

const getImageUrl = (game: Game): string => {
  try {
    if (game.gameCoverBin && game.gameCoverBin.data) {
      const arrayBuffer = new Uint8Array(game.gameCoverBin.data);
      const blob = new Blob([arrayBuffer], { type: 'image/jpg' });
      return URL.createObjectURL(blob);
    } else {
      return '';
    }
  } catch (error) {
    console.error('Error processing image:', error);
    return '';
  }
};

const fetchRecentlyReleasedGames = async (): Promise<void> => {
  try {
    isLoading.value = true;
    const response = await fetch('/api/games/release');
    
    const allGames: Game[] = await response.json();

    recentlyReleasedGames.value = allGames;
  } catch (error) {
    console.error('Error fetching recently released games:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchRecentlyReleasedGames();
});
</script>

<template>
    <div class="recently-released-page">
        <main class="content-wrapper">
            <h2 class="page-title">Recently Released Games</h2>

            <div v-if="isLoading" class="loader">
                <p>Loading recently released games...</p>
            </div>
            <div v-else-if="recentlyReleasedGames.length > 0" class="games-grid">
                <router-link v-for="game in recentlyReleasedGames" :key="game.gameId" class="game-card"
                    :to="{ name: 'GameDetail', params: { id: game.gameId } }">
                    <img :src="getImageUrl(game)" :alt="game.gameName" class="game-cover" />
                </router-link>

            </div>
            <div v-else class="no-games-message">
                <p>No recently released games found.</p>
            </div>
        </main>
    </div>
</template>

<style scoped lang="scss">
@use "../styles/style-variables.scss" as style-variables;

.recently-released-page {
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
<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';

interface Category {
    categoryId: number;
    categoryName: string;
}

interface Game {
    gameId: number | string;
    gameName: string;
    gameTitle: string;
    gameCoverBin?: {
        data: number[];
    };
}

const props = defineProps<{
    id: number;
}>();

const categoryName = ref<string>('');
const games = ref<Game[]>([]);
const isLoading = ref<boolean>(true);

const activeObjectUrls = new Set<string>();

const cleanupUrls = (): void => {
    activeObjectUrls.forEach(url => URL.revokeObjectURL(url));
    activeObjectUrls.clear();
};

const getImageUrl = (game: Game): string => {
    try {
        if (game.gameCoverBin?.data) {
            const arrayBuffer = new Uint8Array(game.gameCoverBin.data);
            const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
            const url = URL.createObjectURL(blob);
            
            // 2. Track the new URL
            activeObjectUrls.add(url);
            return url;
        }
    } catch (error) {
        console.error('Error processing image:', error);
    }
    return '';
};

const fetchData = async (): Promise<void> => {
    cleanupUrls();
    
    isLoading.value = true;
    const categoryId = props.id;

    try {
        const categoryResponse = await fetch(`/api/categories`);
        const allCategoryData: Category[] = await categoryResponse.json();

        const currentCategory = allCategoryData.find(
            (cat) => cat.categoryId === categoryId
        );

        categoryName.value = currentCategory ? currentCategory.categoryName : 'Unknown Category';

        const gamesResponse = await fetch(`/api/games/${categoryId}`);
        const gamesData: Game[] = await gamesResponse.json();
        games.value = gamesData;

    } catch (error) {
        console.error('Error fetching category games:', error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchData();
});

onUnmounted(() => {
    cleanupUrls();
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
                <router-link v-for="game in games" :key="game.gameId"
                    :to="{ name: 'GameDetail', params: { id: game.gameId } }" class="game-card">
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

.page-title {
    font-size: 2.5rem;
    text-transform: uppercase;
    color: style-variables.$default-text-color;
    text-align: center;
    padding-bottom: 30px;
    padding-top: 60px;
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

.loader,
.no-games-message {
    text-align: center;
    font-size: 1.5rem;
    color: style-variables.$default-text-color;
    margin-top: 50px;
}
</style>
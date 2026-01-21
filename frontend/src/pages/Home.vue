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

interface Category {
    categoryId: number;
    categoryName: string;
    games: Game[];
}

const router = useRouter();
const categories = ref<Category[]>([]);
const searchQuery = ref<string>('');
const suggestions = ref<Game[]>([]);
const showSuggestions = ref<boolean>(false);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const fetchSuggestions = async (): Promise<void> => {
    if (debounceTimer) clearTimeout(debounceTimer);

    const term = searchQuery.value.trim();

    if (term.length < 3) {
        suggestions.value = [];
        return;
    }

    debounceTimer = setTimeout(async () => {
        try {
            const response = await fetch(`/api/games/as-you-type/${encodeURIComponent(term)}`);

            if (!response.ok) {
                console.error('Network response was not ok:', response.statusText);
                suggestions.value = [];
                return;
            }

            const data = await response.json();

            if (Array.isArray(data)) {
                suggestions.value = data.slice(0, 3);
            } else {
                console.error('Unexpected data format:', data);
                suggestions.value = [];
            }
        }
        catch (error) {
            console.error('Error fetching search suggestions:', error);
            suggestions.value = [];
        }
    }, 300);
};

const goToGameDetail = (gameId: number): void => {
    showSuggestions.value = false;
    searchQuery.value = '';
    router.push({ name: 'GameDetail', params: { id: gameId } });
};

const handleSearchButton = (): void => {
    if (suggestions.value.length > 0) {
        goToGameDetail(suggestions.value[0].gameId);
    }
};

const createdUrls: string[] = [];

const getImageUrl = (game: Game): string => {
    try {
        if (game.gameCoverBin && game.gameCoverBin.data) {
            const arrayBuffer = new Uint8Array(game.gameCoverBin.data);
            const blob = new Blob([arrayBuffer], { type: 'image/jpg' });
            const url = URL.createObjectURL(blob);
            createdUrls.push(url);
            return url;
        }
        return '';
    }
    catch (error) {
        console.error('Error processing image:', error);
        return '';
    }
};

const fetchCategories = async (): Promise<void> => {
    try {
        const response = await fetch('/api/categories');
        const catData: Omit<Category, 'games'>[] = await response.json();
        
        // Initialize categories with empty games array
        categories.value = catData.map(cat => ({ ...cat, games: [] }));

        // Fetch games for each category
        for (const category of categories.value) {
            try {
                const gamesResponse = await fetch(`/api/games/${category.categoryId}`);
                const gamesData: Game[] = await gamesResponse.json();
                category.games = gamesData.slice(0, 5); 
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

const handleClickOutside = (event: MouseEvent): void => {
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer && !searchContainer.contains(event.target as Node)) {
        showSuggestions.value = false;
    }
};

onMounted(() => {
    fetchCategories();
    window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    window.removeEventListener('click', handleClickOutside);
    createdUrls.forEach(url => URL.revokeObjectURL(url));
});
</script>

<template>
    <div class="homepage">
        <main class="content-wrapper">
            <div class="search-wrapper">
                <div class="search-container">
                    <input type="text" placeholder="search your games..." class="search-input" v-model="searchQuery"
                        @input="fetchSuggestions" @focus="showSuggestions = true" />
                    <button class="search-button" @click="handleSearchButton">
                        <img src="../assets/search.svg" alt="search icon" />
                    </button>
                </div>
                <div v-if="showSuggestions && suggestions.length" class="suggestions-list">
                    <ul>
                        <li v-for="suggestion in suggestions" :key="suggestion.gameId"
                            @click="goToGameDetail(suggestion.gameId)" class="suggestion-item">
                            {{ suggestion.gameName }}
                        </li>
                    </ul>
                </div>
            </div>
            <div v-for="category in categories" :key="category.categoryId">
                <template v-if="category.games?.length > 0">
                    <h2 class="section-title">{{ category.categoryName }}</h2>
                    <div class="game-section">
                        <router-link v-for="game in category.games" :key="game.gameId"
                            :to="{ name: 'GameDetail', params: { id: game.gameId } }" class="game-card">
                            <img :src="getImageUrl(game)" :alt="game.gameName" class="game-cover-image" />
                        </router-link>
                    </div>
                </template>
            </div>
        </main>

    </div>

</template>

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
    flex-direction: column;
    display: flex;
    margin: 0 auto;
    padding: 0 20px;
    padding-bottom: 3%;
}

.search-wrapper {
    position: relative;
    width: 60%;
    margin: 40px auto 20px auto;
}

.search-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
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

.suggestions-list {
    position: absolute;
    background-color: style-variables.$default-navbar-color;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 200px;
    border: 1px solid style-variables.$button-and-border-footer-color;
    margin-top: 5px;
    z-index: 1;

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .suggestion-item {
        padding: 10px 15px;
        cursor: pointer;
        text-align: left;
        color: black;


        &:hover {
            background-color: style-variables.$button-and-border-footer-color;
            color: style-variables.$default-text-color;
        }
    }
}

.section-title {
    padding-top: 5%;
    padding-bottom: 1%;
    font-size: 2rem;
}

.game-section {
    display: flex;
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
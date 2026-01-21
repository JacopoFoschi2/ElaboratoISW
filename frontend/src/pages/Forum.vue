<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

interface Forum {
  gameId: number | string;
  gameName: string;
  gameSmallBannerBin?: {
    data: number[];
  };
}

const router = useRouter();
const forums = ref<Forum[]>([]);
const searchQuery = ref<string>('');
const suggestions = ref<Forum[]>([]);
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
            const response = await fetch(`/api/forums/as-you-type/${encodeURIComponent(term)}`);

            if (!response.ok) {
                console.error('Network response was not ok:', response.statusText);
                suggestions.value = [];
                return;
            }

            const data = await response.json();

            if (Array.isArray(data)) {
                suggestions.value = data.slice(0, 3) as Forum[];
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

const goToForumDetail = (gameId: number | string): void => {
    showSuggestions.value = false;
    searchQuery.value = '';
    router.push({ name: 'ForumDetail', params: { id: gameId } });
};

const handleSearchButton = (): void => {
    if (suggestions.value.length > 0) {
        goToForumDetail(suggestions.value[0].gameId);
    }
};

const getImageUrl = (game: Forum): string => {
    try {
        if (game.gameSmallBannerBin?.data) {
            const arrayBuffer = new Uint8Array(game.gameSmallBannerBin.data);
            const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
            return URL.createObjectURL(blob);
        }
    }
    catch (error) {
        console.error('Error processing image:', error);
    }
    return '';
};

const fetchForums = async (): Promise<void> => {
    try {
        const response = await fetch('/api/forums');
        const data: Forum[] = await response.json();
        forums.value = data;
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
};

const handleClickOutside = (event: MouseEvent) => {
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer && !searchContainer.contains(event.target as Node)) {
        showSuggestions.value = false;
    }
};

onMounted(() => {
    fetchForums();
    window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    window.removeEventListener('click', handleClickOutside);
});
</script>

<template>
    <div class="forum-page">
        <main class="content-wrapper">
            <h2>All Forums</h2>

            <div class="search-wrapper">
                <div class="search-container">
                    <input type="text" placeholder="search your forums..." class="search-input" v-model="searchQuery"
                        @input="fetchSuggestions" @focus="showSuggestions = true" />
                    <button class="search-button" @click="handleSearchButton">
                        <img src="../assets/search.svg" alt="search icon" />
                    </button>
                </div>

                <div v-if="showSuggestions && suggestions.length" class="suggestions-list">
                    <ul>
                        <li v-for="suggestion in suggestions" :key="suggestion.gameId"
                            @click="goToForumDetail(suggestion.gameId)"
                            class="suggestion-item">
                            {{ suggestion.gameName }}
                        </li>
                    </ul>
                </div>
            </div>

                <div v-if="forums.length" class="forum-list">
                    <div v-for="forum in forums" :key="forum.gameId" class="forum-card"
                        @click="goToForumDetail(forum.gameId)">
                        <img class="image-forum" :src="getImageUrl(forum)" :alt="forum.gameName" />
                        <p class="game-title">{{ forum.gameName }}</p>
                    </div>
                </div>
                <p v-else>Loading forums...</p>
        </main>

    </div>

</template>

<style scoped lang="scss">
@use "../styles/style-variables.scss" as style-variables;

.forum-page {
    margin: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: style-variables.$default-background-color;
    overflow-y: auto;
}

.content-wrapper {
    margin: 0 auto;
    max-width: 1200px;
    padding: 0 20px;
    padding-bottom: 3%;
    align-items: center;

    p {
        color: style-variables.$default-text-color;
        font-size: 3rem;
    }
}

h2 {
    font-size: 2.5rem;
    padding-top: 10%;
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

.forum-list {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 30px;

    .forum-card {
        min-width: 600px;
        max-width: 600px;
        max-height: 87px;
        display: flex;
        align-items: center;
        border: 1px solid style-variables.$default-text-color;
        background-color: transparent;
        cursor: pointer;
    }

    .image-forum {
        margin-right: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        max-width: 231px;
        max-height: 87px;
        object-fit: cover;
    }

    .game-title {
        font-size: 1.5rem;
        padding-right: 10px;
    }
}
</style>
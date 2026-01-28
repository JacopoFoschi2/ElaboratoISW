<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "../stores/auth";

interface Game {
  gameId: number;
  gameName: string;
}

interface Category {
  categoryId: number;
  categoryName: string;
}

const authStore = useAuthStore();

const games = ref<Game[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// giochi aperti (accordion)
const expandedGames = ref<Set<number>>(new Set());

// mappa gameId -> categoryId[]
const gameCategoriesMap = ref<Record<number, number[]>>({});

const categories = computed<Category[]>(() => authStore.categories);


const fetchGames = async () => {
  loading.value = true;
  error.value = null;

  try {
    const res = await fetch("/api/games/release");
    if (!res.ok) throw new Error();
    games.value = await res.json();
  } catch {
    error.value = "Error loading games";
  } finally {
    loading.value = false;
  }
};

const fetchGameCategories = async (gameId: number) => {
  if (gameCategoriesMap.value[gameId]) return;

  const res = await fetch(`/api/game-categories/${gameId}`);
  const data = await res.json();

  gameCategoriesMap.value[gameId] = data.map(
    (c: any) => c.categoryId
  );
};


const toggleGame = async (gameId: number) => {
  if (expandedGames.value.has(gameId)) {
    expandedGames.value.delete(gameId);
    return;
  }

  expandedGames.value.add(gameId);
  await fetchGameCategories(gameId);
};

const isChecked = (gameId: number, categoryId: number) => {
  return gameCategoriesMap.value[gameId]?.includes(categoryId);
};

const toggleCategory = async (
  gameId: number,
  categoryId: number,
  checked: boolean
) => {
  // optimistic update
  if (checked) {
    gameCategoriesMap.value[gameId].push(categoryId);
    await fetch("/api/game-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, categoryId }),
    });
  } else {
    gameCategoriesMap.value[gameId] =
      gameCategoriesMap.value[gameId].filter(id => id !== categoryId);

    await fetch(`/api/game-categories/${gameId}/${categoryId}`, {
      method: "DELETE",
    });
  }
};


onMounted(async () => {
  await authStore.fetchCategories();
  await fetchGames();
});
</script>
<template>
<div class="games-admin">
  <h1>Game Categories</h1>

  <div v-if="loading" class="loader">Loading...</div>
  <div v-if="error" class="error">{{ error }}</div>

  <table v-if="games.length">
    <thead>
      <tr>
        <th>Game</th>
        <th>Categories</th>
      </tr>
    </thead>

    <tbody>
      <template v-for="game in games" :key="game.gameId">
        <tr>
          <td>{{ game.gameName }}</td>
          <td>
            <button @click="toggleGame(game.gameId)">
              {{ expandedGames.has(game.gameId) ? "Hide" : "Manage" }}
            </button>
          </td>
        </tr>

        <tr v-if="expandedGames.has(game.gameId)">
          <td colspan="2" class="categories-cell">
            <div class="categories-grid">
              <label
                v-for="cat in categories"
                :key="cat.categoryId"
                class="category-item"
              >
                <input
                  type="checkbox"
                  :checked="isChecked(game.gameId, cat.categoryId)"
                  @change="toggleCategory(
                    game.gameId,
                    cat.categoryId,
                    ($event.target as HTMLInputElement).checked
                  )"
                />
                {{ cat.categoryName }}
              </label>
            </div>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</div>
</template>
<style scoped lang="scss">
@use "../styles/style-variables.scss" as style-variables;
.categories-cell {
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.games-admin {
  width: 100%;
  color: style-variables.$default-text-color;
}
</style>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

interface Game {
  gameId: number;
  gameName: string;
}

const router = useRouter();

const games = ref<Game[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const fetchGames = async () => {
  loading.value = true;
  error.value = null;

  try {
    const res = await fetch('/api/games/release');
    if (!res.ok) throw new Error();
    games.value = await res.json();
  } catch {
    error.value = 'Error loading games';
  } finally {
    loading.value = false;
  }
};

const goToCreate = () => {
  router.push('/super-admin/games/new');
};

const goToEdit = (id: number) => {
  router.push(`/super-admin/games/edit/${id}`);
};

const deleteGame = async (id: number) => {
  await fetch(`/api/games/${id}`, { method: 'DELETE' });
  fetchGames();
};

onMounted(fetchGames);
</script>


<template>
  <div class="games-admin">
    <div class="header">
      <h1>Games Admin</h1>
      <button class="primary" @click="goToCreate">+ New Game</button>
    </div>

    <div v-if="loading" class="loader">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <table v-if="games.length">
      <thead>
        <tr>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="game in games" :key="game.gameId">
          <td>{{ game.gameName }}</td>
          <td class="actions">
            <button @click="goToEdit(game.gameId)">Edit</button>
            <button class="danger" @click="deleteGame(game.gameId)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<style scoped lang="scss">
@use "../styles/style-variables.scss" as style-variables;

.games-admin {
    width: 100%;
    color: style-variables.$default-text-color;
}

.loader {
    font-size: 1.9rem;
    margin-bottom: 20px;
    color: style-variables.$default-text-color;
}

.error {
    color: style-variables.$error-color;
    font-size: 1.9rem;
    margin-bottom: 20px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th {
    font-size: 1.7rem;
}

th,
td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid style-variables.$button-and-border-footer-color;
}

.actions {
    display: flex;
    gap: 10px;
}

button {
    padding: 6px 12px;
    border: none;
    cursor: pointer;
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}


button.primary {
    background-color: style-variables.$button-and-border-footer-color;
    color: style-variables.$default-text-color;
}

button.danger {
    background-color: style-variables.$error-color;
    color: style-variables.$default-text-color;
}

.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.edit-modal {
    background: style-variables.$default-background-color;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 900px;
    max-width: 95vw;
    padding: 32px 40px;
}

.edit-modal input,
.edit-modal textarea {
    width: 100%;
    font-size: 16px;
    padding: 12px 14px;
    margin-bottom: 16px;

    border: none;
    outline: none;
}

.edit-modal textarea {
    min-height: 160px;
    resize: vertical;
}

.edit-modal .modal-actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
}

.edit-modal,
.edit-modal * {
    box-sizing: border-box;
}
</style>

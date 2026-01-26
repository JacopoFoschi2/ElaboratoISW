<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Game {
    gameId: number;
    gameName: string;
    description?: string;
    releaseDate?: string;
    rating?: number;
}

const games = ref<Game[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const showForm = ref(false);
const isEditing = ref(false);
const selectedGameId = ref<number | null>(null);

const originalGame = ref<any | null>(null);


const form = ref({
    gameName: '',
    gameDesc: '',
    gameReleaseDate: '',
    gameSteamLink: '',
    gameEpicLink: '',
    gameGoGLink: '',
});

const fetchGames = async () => {
    loading.value = true;
    error.value = null;

    try {
        const res = await fetch('/api/games/release');
        if (!res.ok) throw new Error('Failed to load games');
        games.value = await res.json();
    } catch (err) {
        error.value = 'Error loading games';
    } finally {
        loading.value = false;
    }
};


const openCreate = () => {
    showForm.value = true;
    isEditing.value = false;
    selectedGameId.value = null;
    form.value = {
        gameName: '',
        gameDesc: '',
        gameReleaseDate: '',
        gameSteamLink: '',
        gameEpicLink: '',
        gameGoGLink: '',
    };
};

const openEdit = async (game: Game) => {
  showForm.value = true;
  isEditing.value = true;
  selectedGameId.value = game.gameId;

  const res = await fetch(`/api/games/${game.gameId}`);
  const data = await res.json();

  form.value = {
    gameName: data.gameName,
    gameDesc: data.gameDesc ?? '',
    gameReleaseDate: data.gameReleaseDate?.split('T')[0] ?? '',
    gameSteamLink: data.gameSteamLink ?? '',
    gameEpicLink: data.gameEpicLink ?? '',
    gameGoGLink: data.gameGoGLink ?? '',
  };
};



const saveGame = async () => {
  const url = isEditing.value
    ? `/api/games/${selectedGameId.value}`
    : '/api/games';

  const method = isEditing.value ? 'PUT' : 'POST';

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value),
  });

  showForm.value = false;
  fetchGames();
};



const deleteGame = async (gameId: number) => {
    try {
        const res = await fetch(`/api/games/${gameId}`, {
            method: 'DELETE',
        });

        if (!res.ok) return;

        fetchGames();
    } catch {
        console.error('Error deleting game');
    }
};


onMounted(fetchGames);
</script>

<template>
    <div class="games-admin">
        <div class="header">
            <h1>Games Admin</h1>
            <button class="primary" @click="openCreate">+ New Game</button>
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
                        <button @click="openEdit(game)">Edit</button>
                        <button class="danger" @click="deleteGame(game.gameId)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="showForm" class="modal-backdrop">
            <div class="edit-modal">
                <h2>{{ isEditing ? 'Edit Game' : 'New Game' }}</h2>

                <input v-model="form.gameName" placeholder="Game name" />
                <textarea v-model="form.gameDesc" placeholder="Description" />
                <input type="date" v-model="form.gameReleaseDate" />
                <input v-model="form.gameSteamLink" placeholder="Steam link" />
                <input v-model="form.gameEpicLink" placeholder="Epic link" />
                <input v-model="form.gameGoGLink" placeholder="GoG link" />

                <div class="modal-actions">
                    <button @click="showForm = false">Cancel</button>
                    <button v-if="showForm" class="primary" :disabled="!form.gameName.trim()" @click="saveGame">
                        Save
                    </button>
                </div>
            </div>
        </div>
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
    background-color: #e53935;
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

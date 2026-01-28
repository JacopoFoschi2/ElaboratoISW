<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface User {
  userId: number;
  userUsername: string;
  userEmail: string;
  userRole: string;
}


const users = ref<User[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const deletingId = ref<number | null>(null);

const fetchUsers = async () => {
  loading.value = true;
  error.value = null;

  try {
    const res = await fetch('/api/users', {
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch users');
    }

    users.value = await res.json();
  } catch (err) {
    error.value = 'Could not load users.';
  } finally {
    loading.value = false;
  }
};

const deleteUser = async (user: User) => {

  const confirmed = confirm(
    `Are you sure you want to delete user "${user.userUsername}"?`
  );

  if (!confirmed) return;

  deletingId.value = user.userId;

  try {
    const res = await fetch(`/api/user/${user.userId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('Delete failed');
    }

    users.value = users.value.filter(u => u.userId !== user.userId);
  } catch {
    console.error('Error deleting user.');
  } finally {
    deletingId.value = null;
  }
};

onMounted(fetchUsers);
</script>

<template>
  <div class="admin-page">
    <h1>Users Management</h1>

    <div v-if="loading" class="loader">Loading users…</div>

    <div v-else-if="error" class="error">{{ error }}</div>

    <table v-else class="users-table">
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th class="actions">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.userId">
          <td>{{ user.userUsername }}</td>
          <td>{{ user.userEmail }}</td>
          <td>
            <span :class="['role', user.userRole]">
              {{ user.userRole }}
            </span>
          </td>
          <td class="actions">
            <button
              class="btn-danger"
              :disabled="deletingId === user.userId"
              @click="deleteUser(user)"
            >
              {{ deletingId === user.userId ? 'Deleting…' : 'Delete' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
@use "../styles/style-variables.scss" as style-variables;
.admin-page {
  padding: 20px;
  color: style-variables.$default-text-color;
}

h1 {
  margin-bottom: 20px;
}

.loader {
  font-size: 1.2rem;
}

.error {
  color: style-variables.$error-color;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px;
  border-bottom: 1px solid style-variables.$button-and-border-footer-color;
  text-align: left;
}

.actions {
  text-align: right;
}

.role {
  padding: 4px 8px;
  font-size: 0.85rem;
  text-transform: uppercase;
}

.role.user {
  background: style-variables.$user-color;
}

.role.admin {
  background: style-variables.$admin-color;
}

.role.master {
  background: style-variables.$super-admin-color;
}

.btn-danger {
  background: style-variables.$error-color;
  color: style-variables.$default-text-color;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

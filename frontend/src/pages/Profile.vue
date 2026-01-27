<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { resizeFileToBlob } from '../utils/resizeFileToBlob';
import { useAuthStore } from '../stores/auth';

interface UserProfile {
  userUsername: string;
  image: string | null;
}

const authStore = useAuthStore();

const isMaster = computed(() => authStore.user?.userRole === 'master');

const previewImage = ref<string | null>(null);
const avatarSrc = computed(() => {
  return (
    previewImage.value ||
    authStore.userAvatar ||
    '/pfpICON.svg'
  );
});

const user = ref<UserProfile>({ userUsername: '', image: null });
const selectedFile = ref<File | null>(null);
const loading = ref(true);
const saving = ref(false);
const usernameExists = ref(false);
const message = ref('');
const isError = ref(false);

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });

const fetchUserProfile = async () => {
  try {
    const { data } = await axios.get('/api/user', { withCredentials: true });
    const u = Array.isArray(data) ? data[0] : data;

    user.value.userUsername = u.userUsername;
  } catch (err) {
    showFeedback('Could not load profile.', true);
  } finally {
    loading.value = false;
  }
};
const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  selectedFile.value = input.files[0];

  if (previewImage.value?.startsWith('blob:')) {
    URL.revokeObjectURL(previewImage.value);
  }

  previewImage.value = URL.createObjectURL(selectedFile.value);
};


const updateProfile = async () => {
  if (usernameExists.value) return;

  saving.value = true;
  message.value = '';

  try {
    const payload: {
      username: string;
      iconBin?: string;
      iconName?: string;
    } = {
      username: user.value.userUsername
    };

    if (selectedFile.value) {
      const resized = await resizeFileToBlob(selectedFile.value, 300, 300);
      const base64 = await blobToBase64(resized);
      payload.iconBin = base64.split(',')[1];
      payload.iconName = selectedFile.value.name;
    }

    await axios.put('/api/user', payload, { withCredentials: true });

    await authStore.loadUser();
    await fetchUserProfile();

    previewImage.value = null;

    showFeedback('Profile updated successfully!', false);
  } catch (err) {
    console.error(err);
    showFeedback('Error updating profile.', true);
  } finally {
    saving.value = false;
  }
};

const checkUsername = async () => {
  if (user.value.userUsername.length < 3) return;
  try {
    const { data } = await axios.get<{ exists: boolean }>(
      `/api/auth/username-exists/${user.value.userUsername}`
    );
    usernameExists.value = data.exists;
  } catch { }
};

const showFeedback = (msg: string, err: boolean) => {
  message.value = msg;
  isError.value = err;
};

onMounted(async () => {
  await authStore.loadUser();
  await fetchUserProfile();
});
</script>


<template>
  <div class="profile-page">
    <div class="profile-card">
      <h2>User Profile</h2>
      <p class="subtitle">Manage your account settings and profile image</p>

      <div v-if="loading" class="loader">Loading profile...</div>
      <form v-else @submit.prevent="updateProfile" class="profile-form">
        <div class="avatar-upload">
          <div class="avatar-preview">
            <img :key="avatarSrc" class="pfp-icon" :src="avatarSrc" alt="User Icon"></img>
          </div>
          <div class="file-input-wrapper">
            <label for="file-upload" class="btn-secondary">Change Photo</label>
            <input id="file-upload" type="file" @change="handleImageUpload" accept="image/*" />
          </div>
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <input id="username" type="text" v-model="user.userUsername" @input="checkUsername"
            :class="{ 'input-error': usernameExists }" placeholder="Enter your username" />
          <span v-if="usernameExists" class="error-text">
            This username is already taken.
          </span>
        </div>

        <div v-if="message" :class="['alert', isError ? 'alert-danger' : 'alert-success']">
          {{ message }}
        </div>

        <div class="form-actions">
          <button type="submit" :disabled="saving || usernameExists" class="btn-primary">
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>

        <router-link to="/reset-password">
          <button type="button" class="btn-primary">Change Password</button>
        </router-link>

        <router-link v-if="isMaster" to="/super-admin">
          <button type="button" class="btn-primary">
            Super Admin Panel
          </button>
        </router-link>

      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../styles/style-variables.scss" as style-variables;

.profile-page {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  background-color: style-variables.$default-background-color;
  min-height: 100vh;
}

.profile-card {
  background: style-variables.$default-navbar-color;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 500px;

  h2 {
    margin-bottom: 10px;
    color: black;
  }
}

.subtitle {
  color: black;
  margin-bottom: 30px;
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 25px;
}

.avatar-preview img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border: 3px solid style-variables.$button-and-border-footer-color;
  margin-bottom: 15px;
}

.file-input-wrapper input[type="file"] {
  display: none;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 8px;
}

input[type="text"] {
  padding: 12px;
  border: 1px solid #ddd;
  font-size: 16px;
}

.input-error {
  border-color: style-variables.$error-color;
}

.error-text {
  color: style-variables.$error-color;
  font-size: 0.85rem;
  margin-top: 5px;
}

.btn-primary {
  background-color: style-variables.$button-and-border-footer-color;
  color: style-variables.$default-text-color;
  border: none;
  padding: 12px 24px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  margin-top: 20px;
}

.btn-secondary {
  background-color: style-variables.$button-and-border-footer-color;
  color: style-variables.$default-text-color;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9rem;
}

.alert {
  padding: 12px;
  margin-bottom: 20px;
  text-align: center;
}

.alert-success {
  background: style-variables.$default-text-color;
  color: #2e7d32;
}

.alert-danger {
  background: #ffebee;
  color: style-variables.$error-color;
}
</style>
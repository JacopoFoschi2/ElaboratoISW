<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { resizeFileToBlob } from '../utils/resizeFileToBlob';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

interface UserProfile {
  userUsername: string;
  image: string | null;
}

const user = ref<UserProfile>({ userUsername: '', image: null });
const previewImage = ref<string | null>(null);
const selectedFile = ref<File | null>(null);
const loading = ref<boolean>(true);
const saving = ref<boolean>(false);
const usernameExists = ref<boolean>(false);
const message = ref<string>('');
const isError = ref<boolean>(false);

const fetchUserProfile = async (): Promise<void> => {
  try {
    const response = await axios.get<any[]>('/api/user');
    if (response.data && response.data.length > 0) {
      const data = response.data[0];
      user.value.userUsername = data.userUsername;

      if (data.userIconBin && data.userIconBin.data) {
        const uint8Array = new Uint8Array(data.userIconBin.data);
        let binary = '';
        uint8Array.forEach(byte => binary += String.fromCharCode(byte));
        user.value.image = `data:image/jpeg;base64,${btoa(binary)}`;
      }
    }
  } catch (error) {
    showFeedback("Could not load profile.", true);
  } finally {
    loading.value = false;
  }
};
const handleImageUpload = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    selectedFile.value = file; 
    const reader = new FileReader();
    reader.onload = (e) => {
      user.value.image = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const updateProfile = async (): Promise<void> => {
  if (usernameExists.value) return;
  saving.value = true;
  message.value = '';
  
  try {
    const formData = new FormData();
    if (authStore.user?.userId) {
      formData.append('userId', authStore.user.userId.toString());
    }
    formData.append('username', user.value.userUsername);
    if (selectedFile.value) {
      const resizedBlob = await resizeFileToBlob(selectedFile.value, 300, 300);
      formData.append('iconBin', resizedBlob, selectedFile.value.name);
      formData.append('iconName', selectedFile.value.name);
    }
    await axios.put('/api/user', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data' 
      }
    });
    
    showFeedback("Profilo aggiornato con successo!", false);
  } catch (error: any) {
    console.error("Errore 500:", error.response?.data);
    showFeedback("Errore server: controlla che lo username sia valido.", true);
  } finally {
    saving.value = false;
  }
};

const checkUsername = async (): Promise<void> => {
  if (!user.value.userUsername || user.value.userUsername.length < 3) return;
  try {
    const response = await axios.get<{ exists: boolean }>(`/api/auth/username-exists/${user.value.userUsername}`);
    usernameExists.value = response.data.exists;
  } catch (error) { console.error(error); }
};

const showFeedback = (msg: string, err: boolean) => {
  message.value = msg;
  isError.value = err;
};

onMounted(fetchUserProfile);
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
            <img :src="previewImage || user.image || '/default-avatar.png'" alt="Profile Preview" />
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
  border: 3px solid #42b883;
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
  border-color: red;
}

.error-text {
  color: red;
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
  background: #e8f5e9;
  color: #2e7d32;
}

.alert-danger {
  background: #ffebee;
  color: #c62828;
}
</style>
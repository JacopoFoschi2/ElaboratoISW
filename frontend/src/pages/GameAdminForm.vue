<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { resizeFileToBlob } from '../utils/resizeFileToBlob';


const today = new Date().toISOString().split('T')[0];


const props = defineProps<{ id?: number }>();
const router = useRouter();

const isEdit = props.id !== undefined;

interface GameForm {
  gameName: string;
  gameAlternateName: string;
  gameDesc: string;
  gameReleaseDate: string;
  gameSteamLink: string;
  gameEpicLink: string;
  gameGoGLink: string;
}

const form = ref<GameForm>({
  gameName: '',
  gameAlternateName: '',
  gameDesc: '',
  gameReleaseDate: '',
  gameSteamLink: '',
  gameEpicLink: '',
  gameGoGLink: '',
});

const SIZES = {
  small: { w: 231, h: 87 },
  big: { w: 616, h: 353 },
  cover: { w: 300, h: 450 }
};


const createdUrls: string[] = [];

const smallBannerPreview = ref('');
const bigBannerPreview = ref('');
const smallBannerFile = ref<File | null>(null);
const bigBannerFile = ref<File | null>(null);
const gameCoverPreview = ref('');
const gameCoverFile = ref<File | null>(null);


function blobToFile(blob: Blob, fileName: string): File {
  return new File([blob], fileName, { type: blob.type });
}

async function validateMinImageSize(
  file: File,
  minWidth: number,
  minHeight: number
): Promise<boolean> {
  const bitmap = await createImageBitmap(file, {
    imageOrientation: "from-image"
  });

  return bitmap.width >= minWidth && bitmap.height >= minHeight;
}

function isDateInFuture(date: string): boolean {
  if (!date) return false;
  return new Date(date) > new Date(today);
}



const bufferToUrl = (buffer?: { data: number[] }) => {
  if (!buffer?.data) return '';
  const blob = new Blob([new Uint8Array(buffer.data)], { type: 'image/jpeg' });
  const url = URL.createObjectURL(blob);
  createdUrls.push(url);
  return url;
};


const loadGame = async () => {
  if (!isEdit) return;

  const res = await fetch(`/api/game/all/${props.id}`);
  if (!res.ok) return;

  const [game] = await res.json();

  form.value = {
    gameName: game.gameName ?? '',
    gameAlternateName: game.gameAlternateName ?? '',
    gameDesc: game.gameDesc ?? '',
    gameReleaseDate: game.gameReleaseDate?.split('T')[0] ?? '',
    gameSteamLink: game.gameSteamLink ?? '',
    gameEpicLink: game.gameEpicLink ?? '',
    gameGoGLink: game.gameGoGLink ?? '',
  };

  smallBannerPreview.value = bufferToUrl(game.gameSmallBannerBin);
  bigBannerPreview.value = bufferToUrl(game.gameBigBannerBin);
  gameCoverPreview.value = bufferToUrl(game.gameCoverBin);
};


const onImageChange = async (
  e: Event,
  type: 'small' | 'big' | 'cover'
) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const { w, h } = SIZES[type];

  const isValid = await validateMinImageSize(file, w, h);
  if (!isValid) {
    alert(
      `Immagine troppo piccola.\n` +
      `Minimo richiesto: ${w}×${h}px`
    );
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    if (type === 'small') {
      smallBannerPreview.value = reader.result as string;
      smallBannerFile.value = file;
    } else if (type === 'big') {
      bigBannerPreview.value = reader.result as string;
      bigBannerFile.value = file;
    } else {
      gameCoverPreview.value = reader.result as string;
      gameCoverFile.value = file;
    }
  };

  reader.readAsDataURL(file);
};



const submit = async () => {
  if (isDateInFuture(form.value.gameReleaseDate)) {
    alert('Release date cannot be in the future.');
    return;
  }

  const formData = new FormData();

  formData.append('gameName', form.value.gameName);
  formData.append('gameAlternateName', form.value.gameAlternateName);
  formData.append('gameDesc', form.value.gameDesc);
  formData.append('gameReleaseDate', form.value.gameReleaseDate);
  formData.append('gameSteamLink', form.value.gameSteamLink);
  formData.append('gameEpicLink', form.value.gameEpicLink);
  formData.append('gameGoGLink', form.value.gameGoGLink);

  if (smallBannerFile.value) {
    const blob = await resizeFileToBlob(
      smallBannerFile.value,
      SIZES.small.w,
      SIZES.small.h
    );
    const file = blobToFile(blob, smallBannerFile.value.name);
    formData.append('gameSmallBanner', file);
  }

  if (bigBannerFile.value) {
    const blob = await resizeFileToBlob(
      bigBannerFile.value,
      SIZES.big.w,
      SIZES.big.h
    );
    const file = blobToFile(blob, bigBannerFile.value.name);
    formData.append('gameBigBanner', file);
  }

  if (gameCoverFile.value) {
    const blob = await resizeFileToBlob(
      gameCoverFile.value,
      SIZES.cover.w,
      SIZES.cover.h
    );
    const file = blobToFile(blob, gameCoverFile.value.name);
    formData.append('gameCover', file);
  }

  const url = isEdit
    ? `/api/games/${props.id}`
    : '/api/games';

  const method = isEdit ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    body: formData,
  });

  if (res.ok) {
    router.push('/super-admin/games');
  }
};




onMounted(loadGame);

onUnmounted(() => {
  createdUrls.forEach(url => URL.revokeObjectURL(url));
});
</script>
<template>
  <div class="game-form">
    <h1>{{ isEdit ? 'Edit Game' : 'New Game' }}</h1>

    <input v-model="form.gameName" placeholder="Game name" />
    <input v-model="form.gameAlternateName" placeholder="Alternate name" />

    <textarea v-model="form.gameDesc" placeholder="Description" />

    <input type="date" v-model="form.gameReleaseDate" :max="today"/>

    <input v-model="form.gameSteamLink" placeholder="Steam link" />
    <input v-model="form.gameEpicLink" placeholder="Epic link" />
    <input v-model="form.gameGoGLink" placeholder="GoG link" />

    <h3>Small Banner</h3>
    <img v-if="smallBannerPreview" :src="smallBannerPreview" />
    <input type="file" accept="image/*" @change="e => onImageChange(e, 'small')" />

    <h3>Big Banner</h3>
    <img v-if="bigBannerPreview" :src="bigBannerPreview" />
    <input type="file" accept="image/*" @change="e => onImageChange(e, 'big')" />

    <h3>Game Cover</h3>
    <img v-if="gameCoverPreview" :src="gameCoverPreview" />
    <input type="file" accept="image/*" @change="e => onImageChange(e, 'cover')" />

    <button class="primary" @click="submit">
      {{ isEdit ? 'Update Game' : 'Create Game' }}
    </button>
  </div>
</template>
<style scoped lang="scss">
@use "../styles/style-variables.scss" as style-variables;

.game-form,
.game-form * {
  box-sizing: border-box;
}


.game-form {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px;

  background-color: style-variables.$default-navbar-color;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);

  display: flex;
  flex-direction: column;
  gap: 18px;
}

h1 {
  font-size: 3.2rem;
  text-align: center;
  color: style-variables.$button-and-border-footer-color;
  margin-bottom: 10px;
}

input,
textarea {
  width: 100%;
  padding: 14px 16px;
  font-size: 1.6rem;

  background-color: style-variables.$default-text-color;
  color: black;

  border: 2px solid transparent;
  outline: none;

  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input::placeholder,
textarea::placeholder {
  color: #888;
}

input:focus,
textarea:focus {
  border-color: style-variables.$button-and-border-footer-color;
  box-shadow: 0 0 0 2px rgba(74, 26, 170, 0.2);
}

textarea {
  min-height: 140px;
  resize: vertical;
}

h3 {
  margin-top: 20px;
  font-size: 1.8rem;
  color: style-variables.$button-and-border-footer-color;
  font-weight: 600;
}

img {
  width: 100%;
  max-height: 1200px;
  object-fit: cover;

  border: 3px solid style-variables.$button-and-border-footer-color;

  margin-bottom: 8px;
}

input[type="file"] {
  padding: 10px;
  background-color: transparent;
  border: none;
  color: style-variables.$button-and-border-footer-color;
}

button.primary {
  margin-top: 30px;
  align-self: flex-end;

  padding: 14px 36px;
  font-size: 1.6rem;
  font-weight: 600;

  background-color: style-variables.$button-and-border-footer-color;
  color: style-variables.$default-text-color;

  border: none;
  cursor: pointer;

  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(74, 26, 170, 0.5);
}

button.primary:active {
  transform: translateY(0);
  box-shadow: none;
}
</style>
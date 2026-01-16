<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import moment from 'moment';

const props = defineProps({
    id: {
        type: Number,
        required: true
    }
});

const gameInfo = ref({});
const bannerUrl = ref('');
const comments = ref([]);
const isLoading = ref(true);
const createdUrls = [];

const bufferToUrl = (imageBuffer) => {
    if (!imageBuffer || !imageBuffer.data) return '';
    const uint8Array = new Uint8Array(imageBuffer.data);
    const blob = new Blob([uint8Array], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob);
    createdUrls.push(url);
    return url;
};

const fetchForumDetails = async () => {
    try {
        isLoading.value = true;

        const gameRes = await fetch(`/api/game/${props.id}`);
        const gameData = await gameRes.json();

        if (gameData.length > 0) {
            gameInfo.value = gameData[0];
        }else {
            gameInfo.value = {};
        }

        const [bannerRes, dataRes] = await Promise.all([
            fetch(`/api/games/${props.id}/banner`),
            fetch(`/api/games/${props.id}/comments`)
        ]);

        const bannerData = await bannerRes.json();
        const commentsData = await dataRes.json();

        if (bannerData.length > 0) {
            const banner = bannerData[0];
            bannerUrl.value = bufferToUrl(banner.gameBigBannerBin);
        }

        comments.value = commentsData.map(comment => ({
            ...comment,
            userIconUrl: bufferToUrl(comment.userIconBin),
            displayName: comment.userUsername,
            commentDate: comment.commentTimeStamp,
            commentText: comment.commentBody
        }));
    } catch (error) {
        console.error('Error fetching forum details:', error);
    } finally {
        isLoading.value = false;
    }


};

onMounted(fetchForumDetails);

onUnmounted(() => {
    createdUrls.forEach(url => URL.revokeObjectURL(url));
});
</script>

<template>
    <div v-if="isLoading" class="loader">Loading...</div>

    <div v-else class="page-container">
        <div class="game-banner" :style="{ backgroundImage: bannerUrl ? `url(${bannerUrl})` : '' }">
            <h2 class="game-title">{{ gameInfo.gameName }}</h2>
        </div>
        <main class="content-wrapper">
                <h2>Comments</h2>
                <div v-if="comments.length" class="comments-list">
                    <div v-for="(comment, index) in comments" :key="index" class="comment-card">
                        <img :src="comment.userIconUrl" alt="User Icon" class="user-icon" />
                        <div class="comment-content">
                            <p class="username">{{ comment.displayName }}</p>
                            <p class="comment-date">{{ moment(comment.commentDate).format('MMMM Do YYYY, h:mm:ss a') }}</p>
                            <p class="comment-text">{{ comment.commentText }}</p>
                        </div>
                    </div>
                </div>
                <p v-else class="non-available">No comments available.</p>
        </main>
    </div>
</template>

<style scoped lang="scss">
@use "../styles/style-variables.scss" as style-variables;

.content-wrapper {
    height: 100vh;
    flex-direction: column;
    display: flex;
    margin: 0 auto;
    padding: 0 20px;

    .non-available {
        font-size: 3.2rem;
        color: style-variables.$default-text-color;
        text-align: center;
    }
}

.loader {
    font-size: 1.5rem;
    text-align: center;
    margin-top: 50px;
    color: style-variables.$default-text-color;
}

.game-banner {
    height: 300px;
    width: 100%;
    background-size: cover;
    background-position: center;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;

    .game-title {
        margin: 0;
        color: style-variables.$default-text-color;
        background-color: rgba(0, 0, 0, 0.5);
        width: 100%;
        height: 100%;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        padding: 0 20px;        
        font-size: 2.5rem;
        z-index: 1;
    }
}



    h2 {
        margin-bottom: 15px;
        color: style-variables.$default-text-color;
    }

    .comments-list {
        display: flex;
        flex-direction: column;
        gap: 15px;

        .comment-card {
            display: flex;
            gap: 15px;
            background-color: style-variables.$default-background-color;
            border: 1px solid style-variables.$default-text-color;
            padding: 10px;

            .user-icon {
                margin-top: 10px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                object-fit: cover;
            }

            .comment-content {
                .username {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: style-variables.$default-text-color;
                }

                .comment-text {
                    font-size: 1.2rem;
                    color: style-variables.$default-text-color;
                }
            }
        }
    }
</style>
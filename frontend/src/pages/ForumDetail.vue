<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import moment from 'moment';

interface GameInfo {
    gameId?: number | string;
    gameName?: string;
    gameTitle?: string;
    gameDescription?: string;
}

interface Comment {
    commentId: number;
    userId: number;
    userUsername: string;
    commentTimeStamp: string;
    commentBody: string;
    commentWasEdited: boolean | number;
    userIconBin?: { data: number[] };
    // UI mapped properties
    userIconUrl: string;
    displayName: string;
    commentDate: string;
    commentText: string;
    isEdited: boolean | number;
}

const props = defineProps<{
    id: number;
}>();

const auth = useAuthStore();
const newComment = ref<string>('');
const isSubmitting = ref<boolean>(false);

const editingCommentId = ref<number | null>(null);
const editedCommentText = ref<string>('');

const gameInfo = ref<GameInfo>({});
const bannerUrl = ref<string>('');
const comments = ref<Comment[]>([]);
const isLoading = ref<boolean>(true);

const createdUrls: string[] = [];

const deletingCommentId = ref<number | null>(null);
const deleteError = ref<string | null>(null);


const isAdmin = (): boolean => {
    return auth.user?.userRole === 'admin' || auth.user?.userRole === 'master';
};

const canDelete = (comment: Comment): boolean => {
    return isAuthor(comment) || isAdmin();
};

const bufferToUrl = (imageBuffer?: { data: number[] }): string => {
    if (!imageBuffer || !imageBuffer.data) return '';
    try {
        const uint8Array = new Uint8Array(imageBuffer.data);
        const blob = new Blob([uint8Array], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        createdUrls.push(url);
        return url;
    } catch (error) {
        console.error('Error creating image URL:', error);
        return '';
    }
};

const fetchForumDetails = async (): Promise<void> => {
    try {
        isLoading.value = true;

        const gameRes = await fetch(`/api/game/${props.id}`);
        const gameData: GameInfo[] = await gameRes.json();

        if (gameData.length > 0) {
            gameInfo.value = gameData[0];
        } else {
            gameInfo.value = {};
        }

        const [bannerRes, dataRes] = await Promise.all([
            fetch(`/api/games/${props.id}/banner`),
            fetch(`/api/games/${props.id}/comments`)
        ]);

        const bannerData = await bannerRes.json();
        const commentsData: any[] = await dataRes.json();

        if (bannerData.length > 0) {
            const banner = bannerData[0];
            bannerUrl.value = bufferToUrl(banner.gameBigBannerBin);
        }

        // Map the raw API comments to our typed Comment interface
        comments.value = commentsData.map(comment => ({
            ...comment,
            userIconUrl: bufferToUrl(comment.userIconBin),
            displayName: comment.userUsername,
            commentDate: comment.commentTimeStamp,
            commentText: comment.commentBody,
            isEdited: !!comment.commentWasEdited
        }));
    } catch (error) {
        console.error('Error fetching forum details:', error);
    } finally {
        isLoading.value = false;
    }
};

const submitComment = async (): Promise<void> => {
    if (!auth.isLoggedIn || !auth.user || !newComment.value.trim()) return;

    isSubmitting.value = true;

    try {
        const response = await fetch(`/api/games/${props.id}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            },
            body: JSON.stringify({
                gameId: props.id,
                commentBody: newComment.value
            })
        });

        if (response.ok) {
            const createdComment = await response.json();

            comments.value.unshift({
                ...createdComment,
                userIconUrl: bufferToUrl(createdComment.userIconBin),
                displayName: createdComment.userUsername,
                commentDate: createdComment.commentTimeStamp,
                commentText: createdComment.commentBody,
                isEdited: !!createdComment.commentWasEdited
            });

            newComment.value = '';
        }
    } finally {
        isSubmitting.value = false;
    }
};

const deleteComment = async (commentId: number) => {
    deleteError.value = null;
    deletingCommentId.value = commentId;

    try {
        const res = await fetch(`/api/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        });

        if (!res.ok) {
            deleteError.value = 'Unable to delete comment.';
            return;
        }

        comments.value = comments.value.filter(
            c => c.commentId !== commentId
        );

    } catch (err) {
        deleteError.value = 'Network error while deleting comment.';
    } finally {
        deletingCommentId.value = null;
        editingCommentId.value = null;
    }
};


const cancelEdit = () => {
    editingCommentId.value = null;
    editedCommentText.value = '';
};

const isAuthor = (comment: Comment): boolean => {
    if (!auth.user) return false;
    return auth.user.userId === comment.userId;
};


const startEdit = (comment: Comment): void => {
    editingCommentId.value = comment.commentId;
    editedCommentText.value = comment.commentText;
};

const saveEdit = async (commentId: number) => {
    if (!auth.user) return;
    if (!editedCommentText.value.trim()) return;

    try {
        const response = await fetch(`/api/comments/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            },
            body: JSON.stringify({
                commentBody: editedCommentText.value,
                userId: auth.user.userId
            })
        });

        if (response.ok) {
            const updated = await response.json();

            const index = comments.value.findIndex(c => c.commentId === commentId);
            if (index !== -1) {
                comments.value[index].commentText = updated.commentBody;
                comments.value[index].isEdited = true;
            }

            cancelEdit();
        }
    } catch (error) {
        console.error('Error updating comment:', error);
    }
};


onMounted(() => {
    fetchForumDetails();
});

onUnmounted(() => {
    // Revoke all created URLs to free up memory
    createdUrls.forEach(url => URL.revokeObjectURL(url));
});
</script>

<template>
    <div v-if="isLoading" class="loader">Loading...</div>

    <div v-else>
        <div class="game-banner" :style="{ backgroundImage: bannerUrl ? `url(${bannerUrl})` : '' }">
            <h2 class="game-title">{{ gameInfo.gameName }}</h2>
        </div>

        <main class="content-wrapper">
            <section v-if="auth.isLoggedIn" class="add-comment-section">
                <h2>Add a Comment</h2>
                <textarea v-model="newComment" placeholder="Write your comment here..." rows="4"
                    class="comment-textarea"></textarea>

                <button @click="submitComment" :disabled="isSubmitting" class="submit-comment-button">
                    {{ isSubmitting ? 'Submitting...' : 'Submit Comment' }}
                </button>
            </section>
            <p v-else class="login-prompt">
                Please log in from the navigation bar to add a comment.
            </p>

            <h2>Comments</h2>

            <div v-if="comments.length" class="comments-list">
                <div v-for="comment in comments" :key="comment.commentId" class="comment-card">
                    <img :src="comment.userIconUrl" alt="User Icon" class="user-icon" />

                    <div class="comment-content">
                        <p class="username">{{ comment.displayName }}</p>

                        <p class="comment-date">
                            {{ moment(comment.commentDate).format('MMMM Do YYYY, h:mm:ss a') }}
                        </p>
                        <p v-if="editingCommentId !== comment.commentId" class="comment-text">
                            {{ comment.commentText }}
                        </p>
                        <textarea v-else v-model="editedCommentText" rows="3" class="comment-textarea"></textarea>

                        <p v-if="comment.isEdited" class="edited-label">(Edited)</p>

                        <div v-if="isAuthor(comment) || isAdmin()" class="comment-actions">

                            <!-- EDIT -->
                            <button
                                v-if="isAuthor(comment) && editingCommentId !== comment.commentId && deletingCommentId !== comment.commentId"
                                @click="startEdit(comment)">
                                Edit
                            </button>

                            <!-- SAVE / CANCEL -->
                            <template v-if="editingCommentId === comment.commentId">
                                <button @click="saveEdit(comment.commentId)">
                                    Save
                                </button>
                                <button @click="cancelEdit">
                                    Cancel
                                </button>
                            </template>

                            <!-- DELETE -->
                            <button
                                v-if="canDelete(comment) && deletingCommentId !== comment.commentId && editingCommentId !== comment.commentId"
                                @click="deletingCommentId = comment.commentId">
                                Delete
                            </button>

                            <!-- DELETE CONFIRM -->
                            <template v-if="deletingCommentId === comment.commentId">
                                <p class="delete-warning">Delete this comment?</p>
                                <button @click="deleteComment(comment.commentId)">
                                    Yes
                                </button>
                                <button @click="deletingCommentId = null">
                                    No
                                </button>
                            </template>

                            <p v-if="deleteError && deletingCommentId === comment.commentId" class="error">
                                {{ deleteError }}
                            </p>
                        </div>
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
    min-height: 100vh;
    flex-direction: column;
    display: flex;
    margin: 0 auto;
    padding: 0 20px;
    padding-bottom: 10%;

    .non-available {
        font-size: 3.2rem;
        color: style-variables.$default-text-color;
        text-align: center;
    }

    .login-prompt {
        font-size: 1.5rem;
        color: style-variables.$default-text-color;
        text-align: center;
        border: 1px solid style-variables.$button-and-border-footer-color;
        padding: 15px;
    }
}

.add-comment-section {
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;

    h2 {
        font-size: 2rem;
    }

    .comment-textarea {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid style-variables.$button-and-border-footer-color;
        font-size: 1rem;
        color: style-variables.$default-text-color;
        background-color: style-variables.$default-background-color;
        resize: vertical;
    }

    .submit-comment-button {
        width: 100%;
        font-size: 1.5rem;
        margin-top: 10px;
        padding: 20px 20px;
        background-color: style-variables.$button-and-border-footer-color;
        color: style-variables.$default-text-color;
        border: none;
        cursor: pointer;
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
        font-size: 3rem;
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


    .comment-actions {
        button {
            margin-top: 10px;
            margin-right: 10px;
            padding: 5px 10px;
            font-size: 1rem;
            cursor: pointer;
            background-color: style-variables.$button-and-border-footer-color;
            color: style-variables.$default-text-color;
            border: none;
        }
    }

    .comment-card {
        display: flex;
        gap: 15px;
        background-color: style-variables.$default-background-color;
        border: 1px solid style-variables.$default-text-color;
        padding: 10px;

        .user-icon {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
        }

        .comment-content {
            .username {
                margin-top: 0;
                margin-bottom: 10px;
                font-size: 2rem;
                font-weight: bold;
                color: style-variables.$default-text-color;
            }

            .comment-date {
                font-style: italic;
                margin-top: 0;
                font-size: 1rem;
                color: style-variables.$default-text-color;
                margin-bottom: 10px;
            }

            .comment-text {
                font-size: 1.5rem;
                color: style-variables.$default-text-color;
                width: 100%;
                margin-bottom: 5px;
            }

            .edited-label {
                font-size: 1rem;
                color: rgb(255, 255, 255, 0.7);
                margin: 0;
            }
        }
    }
}
</style>
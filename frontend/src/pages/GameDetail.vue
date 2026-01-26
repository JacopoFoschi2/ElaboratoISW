<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import StarRating from '../components/StarRating.vue';
import moment from 'moment';
import { computed } from 'vue';


interface Game {
    gameId: number;
    gameName: string;
    gameRating: number;
    gameReleaseDate: string;
    gameDesc: string;
    gameCoverBin?: { data: number[] };
    gameSteamLink?: string;
    gameGoGLink?: string;
    gameEpicLink?: string;
}

interface Review {
    reviewId: number;
    userId: number;
    reviewTitle: string;
    reviewBody: string;
    reviewRating: number;
    reviewTimeStamp: string;
    userUsername: string;
    userIconBin?: { data: number[] };
    userIconUrl?: string;
}

interface ReviewForm {
    title: string;
    content: string;
    rating: number;
}

const props = defineProps<{
    id: number;
}>();

const auth = useAuthStore();
const game = ref<Game | null>(null);
const loading = ref<boolean>(true);
const reviews = ref<Review[]>([]);
const showReviewModal = ref<boolean>(false);
const isOwned = ref<boolean | null>(null);
const isWishlisted = ref<boolean | null>(null);
const canWriteReview = ref<boolean>(false);
const editingReview = ref<Review | null>(null);
const deleteConfirmId = ref<number | null>(null);


const reviewData = ref<ReviewForm>({
    title: '',
    content: '',
    rating: 1
});

// Memory management for images
const createdUrls: string[] = [];

const averageRating = computed(() => {
    if (reviews.value.length === 0) return 0;

    const sum = reviews.value.reduce(
        (acc, r) => acc + r.reviewRating,
        0
    );

    return sum / reviews.value.length;
});

const bufferToUrl = (imageBuffer?: { data: number[] }): string => {
    if (!imageBuffer || !imageBuffer.data) return '';
    try {
        const uint8Array = new Uint8Array(imageBuffer.data);
        const blob = new Blob([uint8Array], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        createdUrls.push(url);
        return url;
    } catch (error) {
        return '';
    }
};

const fetchReviews = async (): Promise<void> => {
    try {
        const response = await fetch(`/api/reviews/game/${props.id}`);
        if (response.ok) {
            const data: Review[] = await response.json();
            reviews.value = data.map(r => ({
                ...r,
                userIconUrl: bufferToUrl(r.userIconBin)
            }));
        }
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
};

const startEdit = (review: Review) => {
    editingReview.value = review;

    reviewData.value = {
        title: review.reviewTitle,
        content: review.reviewBody,
        rating: review.reviewRating
    };

    showReviewModal.value = true;
};


const fetchOwnedStatus = async () => {
    if (!auth.isLoggedIn) {
        isOwned.value = false;
        return;
    }

    try {
        const res = await fetch(`/api/owned/${props.id}`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        });

        if (!res.ok) {
            isOwned.value = false;
            return;
        }

        const data = await res.json();
        isOwned.value = Boolean(data.exists);
    } catch (error) {
        console.error('Error checking owned status:', error);
        isOwned.value = false;
    }
};


const fetchWishlistStatus = async () => {
    if (!auth.isLoggedIn) {
        isWishlisted.value = false;
        return;
    }

    try {
        const res = await fetch(`/api/wishlist/${props.id}`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        });

        if (!res.ok) {
            isWishlisted.value = false;
            return;
        }

        const data = await res.json();
        isWishlisted.value = Boolean(data.exists);
    } catch (error) {
        console.error('Error checking wishlist status:', error);
        isWishlisted.value = false;
    }
};

const toggleOwned = async () => {
    const method = isOwned.value ? 'DELETE' : 'POST';

    const res = await fetch(`/api/owned/${props.id}`, {
        method,
        headers: {
            'Authorization': `Bearer ${auth.token}`
        }
    });

    if (res.ok) {
        isOwned.value = !isOwned.value;
    }
};

const toggleWishlist = async () => {
    const method = isWishlisted.value ? 'DELETE' : 'POST';

    const res = await fetch(`/api/wishlist/${props.id}`, {
        method,
        headers: {
            'Authorization': `Bearer ${auth.token}`
        }
    });

    if (res.ok) {
        isWishlisted.value = !isWishlisted.value;
    }
};

const isAuthor = (review: Review): boolean => {
    if (!auth.user) return false;
    return auth.user.userId === review.userId;
};

const fetchReviewPermission = async () => {
    if (!auth.isLoggedIn) {
        canWriteReview.value = false;
        return;
    }

    try {
        const res = await fetch(`/api/reviews/permission/${props.id}`, {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        });

        if (!res.ok) {
            canWriteReview.value = false;
            return;
        }

        const data = await res.json();
        canWriteReview.value = Boolean(data.canReview);
    } catch (err) {
        console.error('Error checking review permission:', err);
        canWriteReview.value = false;
    }
};

const submitReview = async (): Promise<void> => {
    if (!auth.isLoggedIn || !auth.user) return;

    const isEdit = Boolean(editingReview.value);

    const response = await fetch(`/api/reviews/${props.id}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify({
            reviewTitle: reviewData.value.title,
            reviewBody: reviewData.value.content,
            reviewRating: reviewData.value.rating
        })
    });

    if (!response.ok) return;

    showReviewModal.value = false;
    editingReview.value = null;
    reviewData.value = { title: '', content: '', rating: 1 };

    await refreshAfterReviewChange();
};

const deleteReview = async (review: Review) => {
    if (deleteConfirmId.value !== review.reviewId) {
        deleteConfirmId.value = review.reviewId;
        return;
    }

    const response = await fetch(`/api/reviews/${props.id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${auth.token}`
        }
    });

    if (!response.ok) return;

    deleteConfirmId.value = null;
    await refreshAfterReviewChange();
};



const refreshAfterReviewChange = async () => {
    await fetchReviews();
    await fetchReviewPermission();
    await fetchGameRating();
};

const fetchGameRating = async () => {
    const res = await fetch(`/api/game/${props.id}`);
    const data = await res.json();
    if (data?.length) {
        game.value!.gameRating = data[0].gameRating;
    }
};



onMounted(async () => {
    try {
        const response = await fetch(`/api/game/${props.id}`);
        const data = await response.json();
        if (data && data.length > 0) {
            game.value = data[0];
        }

        await fetchReviews();
        await fetchOwnedStatus();
        await fetchWishlistStatus();
        await fetchReviewPermission();


    } catch (error) {
        console.error('Error loading game details:', error);
    } finally {
        loading.value = false;
    }
});

onUnmounted(() => {
    createdUrls.forEach(url => URL.revokeObjectURL(url));
});
</script>

<template>
    <div v-if="!loading && game" class="game-detail-page">
        <main class="content-wrapper">
            <aside class="left-column">
                <img :src="bufferToUrl(game.gameCoverBin)" :alt="game.gameName" class="game-cover" />

                <div class="rating-container">
                    <p class="rating-label">Rating: {{ Math.floor(averageRating) }} / 5</p>
                    <StarRating :rating="Math.floor(averageRating)" :size="10" />
                </div>

                <h3>Available on:</h3>
                <div class="available-container">
                    <ul>
                        <li v-if="game.gameSteamLink">
                            <a :href="game.gameSteamLink" target="_blank">
                                <img src='../assets/availableIcons/SteamLogo.svg' alt="Steam Logo" />
                            </a>
                        </li>
                        <li v-if="game.gameGoGLink">
                            <a :href="game.gameGoGLink" target="_blank">
                                <img src='../assets/availableIcons/GogLogo.svg' alt="Gog Logo" />
                            </a>
                        </li>
                        <li v-if="game.gameEpicLink">
                            <a :href="game.gameEpicLink" target="_blank">
                                <img src='../assets/availableIcons/EpicLogo.svg' alt="Epic Games Logo" />
                            </a>
                        </li>
                    </ul>
                </div>

                <div v-if="auth.isLoggedIn" class="game-actions">
                    <template v-if="isOwned !== null && isWishlisted !== null">

                        <button class="owned-btn" @click="toggleOwned">
                            {{ isOwned ? 'Remove from Owned' : 'Add to Owned' }}
                        </button>

                        <button class="wishlist-btn" @click="toggleWishlist">
                            <span v-if="isWishlisted">✔ In Wishlist</span>
                            <span v-else>♡ Add to Wishlist</span>
                        </button>

                    </template>

                    <p v-else class="status-loading">
                        Checking library status...
                    </p>
                </div>
            </aside>

            <div class="right-column">
                <h2 class="game-title">{{ game.gameName }}</h2>
                <p class="game-release-date">{{ moment(game.gameReleaseDate).format('DD/MM/YYYY') }}</p>
                <p class="game-description">{{ game.gameDesc }}</p>
            </div>
        </main>

        <section class="review-section" v-if="auth.isLoggedIn && canWriteReview">
            <button class="review-btn" @click="showReviewModal = true">
                {{ editingReview ? 'Edit your review' : 'Write your review' }}
            </button>
        </section>

        <p v-else-if="auth.isLoggedIn && !canWriteReview" class="login-prompt">
            You already wrote a review for this game.
        </p>

        <p v-else class="login-prompt">
            Please log in from the navigation bar to add a review.
        </p>


        <section class="reviews-list-section" v-if="reviews.length > 0">
            <h2>User Reviews</h2>
            <div v-for="review in reviews" :key="review.reviewId" class="review-card">
                <img :src="review.userIconUrl" alt="User Icon" class="user-icon" />
                <p class="username">{{ review.userUsername }}</p>
                <h2 class="review-title">{{ review.reviewTitle }}</h2>
                <div class="rating-container">
                    <p class="rating-label">Rating: {{ review.reviewRating }} / 5</p>
                    <StarRating :rating="review.reviewRating" :size="10" />
                </div>
                <p class="review-date">{{ moment(review.reviewTimeStamp).format('MMMM Do YYYY, h:mm:ss a') }}</p>
                <p class="review-content">{{ review.reviewBody }}</p>

                <div v-if="isAuthor(review)" class="review-actions">
                    <button v-if="deleteConfirmId !== review.reviewId" @click="startEdit(review)">
                        Edit
                    </button>
                    <button @click="deleteReview(review)">
                        {{ deleteConfirmId === review.reviewId ? 'Confirm delete' : 'Delete' }}
                    </button>
                    <button v-if="deleteConfirmId === review.reviewId" @click="deleteConfirmId = null">
                        Cancel
                    </button>

                </div>


                <p v-if="deleteConfirmId === review.reviewId" class="delete-warning">
                    Are you sure you want to delete this review? This action cannot be undone.
                </p>

            </div>
        </section>

        <div v-if="showReviewModal" class="modal-overlay" @click="showReviewModal = false">
            <div class="review-modal" @click.stop>
                <h2>Write your review</h2>
                <form @submit.prevent="submitReview">
                    <input v-model="reviewData.title" type="text" placeholder="Review Title" required />

                    <div class="rating-input">
                        <label for="review-rating">Rating (1-5):</label>
                        <select id="review-rating" v-model.number="reviewData.rating" required>
                            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                        </select>
                    </div>

                    <label for="review-content">Content:</label>
                    <textarea id="review-content" v-model="reviewData.content" placeholder="Your review..." rows="5"
                        required></textarea>

                    <div class="modal-actions">
                        <button type="submit">Submit Review</button>
                        <button type="button" @click="showReviewModal = false">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div v-else>
        <p class="loader">Loading...</p>
    </div>
</template>
<style scoped lang="scss">
@use "../styles/style-variables.scss" as style-variables;

.game-detail-page {
    margin: 0;
    min-height: 100vh;
    background-color: style-variables.$default-background-color;
    padding: 60px 20px;
    overflow-y: auto;

    .login-prompt {
        font-size: 1.5rem;
        color: style-variables.$default-text-color;
        text-align: center;
        border: 1px solid style-variables.$button-and-border-footer-color;
        padding: 15px;
    }

    .reviews-list-section {
        max-width: 1200px;
        margin: 20px auto;
        color: style-variables.$default-text-color;

        h2 {
            font-size: 2.5rem;
            margin-bottom: 50px;
        }

        .review-actions {
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

            .delete-warning {
                margin-top: 10px;
                color: red;
                font-weight: bold;
            }
        }

    }

    .review-card {
        background-color: style-variables.$default-background-color;
        border: 1px solid style-variables.$default-text-color;
        padding: 20px;
        margin-bottom: 20px;

        .username {
            display: inline-block;
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 1.5rem;
            font-weight: bold;
            color: style-variables.$default-text-color;
        }

        .rating-container {
            display: flex;
            align-items: center;
            margin-bottom: 0;
        }

        .review-title {
            font-size: 3rem;
            margin: 10px 0;
        }

        .user-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
        }

        .review-date {
            font-size: 1.0rem;
            color: style-variables.$default-text-color;
            margin-top: 0;
            margin-bottom: 30px;
        }

        .review-content {
            font-size: 1.5rem;
            color: style-variables.$default-text-color;
        }
    }
}

.content-wrapper {
    margin: 0 auto;
    max-width: 1200px;
    display: flex;
    padding-bottom: 3%;
    gap: 40px;
    align-items: flex-start;
}

.left-column {
    flex: 0 0 400px;

    .game-cover {
        width: 100%;
        height: auto;
    }

    .game-actions {
        display: flex;
        gap: 15px;
        margin: 45px 0;

        button {
            padding: 10px 20px;
            font-size: 1.2rem;
            cursor: pointer;
            border: 1px solid style-variables.$default-text-color;
            background-color: transparent;
            color: style-variables.$default-text-color;
            transition: all 0.3s;

            &:hover {
                background-color: style-variables.$default-text-color;
                color: style-variables.$default-background-color;
            }
        }

        .wishlist-btn {
            font-weight: bold;
        }
    }
}

.right-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;

    .game-title {
        font-size: 3.5rem;
        font-weight: 500;
        color: style-variables.$default-text-color;
        margin: 0;
    }

    .game-release-date {
        font-size: 1.8rem;
        color: style-variables.$default-text-color;
        padding: 0;
        margin: 0;
    }

    .game-description {
        font-size: 1.5rem;
        color: style-variables.$default-text-color;
    }


}




.rating-container {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.5rem;
    color: style-variables.$default-text-color;

    .rating-label {
        font-weight: bold;
        font-size: 2rem;
    }
}



h3 {
    font-size: 2rem;
    color: style-variables.$default-text-color;
    margin-bottom: 10px;
}

.available-container {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px 30px;
    background-color: style-variables.$default-navbar-color;
    max-width: fit-content;


    ul {
        list-style: none;
        padding: 0;
        display: flex;
        gap: 20px;

        li img {
            width: 50px;
            height: auto;
            transition: transform 0.3s;

            &:hover {
                transform: scale(1.1);
            }
        }
    }
}

.game-description {
    font-size: 1.5rem;
    color: style-variables.$default-text-color;
    max-width: 800px;
    line-height: 1.5;
}

.review-section {
    max-width: 1200px;
    text-align: center;
    background-color: style-variables.$button-and-border-footer-color;
    border: 1px solid style-variables.$default-text-color;
    margin: 0 auto 40px auto;

    .review-btn {
        width: 100%;
        padding: 10px;
        font-size: 1.5rem;
        background: transparent;
        color: style-variables.$default-text-color;
        cursor: pointer;
        transition: background-color 0.3s;
    }
}


.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
}

.review-modal {
    background-color: style-variables.$default-background-color;
    border: 1px solid style-variables.$default-text-color;
    padding: 30px;
    width: 80%;
    color: style-variables.$default-text-color;

    h2 {
        margin-top: 0;
        color: style-variables.$default-text-color;
        padding-bottom: 15px;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    input,
    textarea {
        font-size: 1rem;
        border: 1px solid style-variables.$default-text-color;
        background-color: style-variables.$default-background-color;
        color: style-variables.$default-text-color;
        padding: 10px;
    }

    .rating-input {
        margin-bottom: 15px;
        display: flex;
        flex-direction: column;

        label {
            margin-bottom: 5px;
        }

        select {
            width: 100%;
            padding: 10px;
            border: 1px solid style-variables.$button-and-border-footer-color;
            font-size: 1rem;
            color: style-variables.$default-text-color;
            background-color: style-variables.$default-background-color;
        }
    }

    input,
    select,
    textarea {
        width: 100%;
        padding: 10px;
        margin-bottom: 15px;
        border: 1px solid style-variables.$button-and-border-footer-color;
        font-size: 1rem;
        color: style-variables.$default-text-color;
        background-color: style-variables.$default-background-color;
    }

    .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;

        button {
            padding: 10px 15px;
            font-size: 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            background-color: style-variables.$button-and-border-footer-color;
            color: style-variables.$default-text-color;

            &:hover {
                background-color: style-variables.$default-text-color;
                color: style-variables.$default-background-color;
            }
        }
    }
}
</style>
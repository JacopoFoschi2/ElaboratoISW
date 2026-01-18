<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import StarRating from '../components/StarRating.vue';
import moment from 'moment';

const props = defineProps({
    id: {
        type: Number,
        required: true
    }
});
const game = ref(null);
const loading = ref(true);
const reviews = ref([]);
const showReviewModal = ref(false);

const auth = useAuthStore();
const isLoggedIn = auth.isLoggedIn;
const reviewData = ref({
    title: '',
    content: '',
    rating: 0
});

const submitReview = async () => {
    if (!auth.isLoggedIn) return;

    try {
        const response = await fetch(`/api/game/${props.id}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            },
            body: JSON.stringify({
                gameId: props.id,
                userId: auth.user.id,
                ...reviewData.value
            })
        });

        if (response.ok) {
            showModal.value = false;
            reviewData.value = { title: '', rating: 5, comment: '' };

            const reviewsResponse = await fetch(`/api/reviews/game/${props.id}`);
            if (reviewsResponse.ok) {
                reviews.value = await reviewsResponse.json();
            } else {
                console.error('Failed to fetch reviews:', reviewsResponse.statusText);
            }
        }
    } catch (error) {
        console.error('Error submitting review:', error);
    }
};



const getImageUrl = (imageBuffer) => {
    if (!imageBuffer || !imageBuffer.data) return '';
    const binary = String.fromCharCode(...imageBuffer.data);
    const base64String = window.btoa(binary);
    return `data:image/jpg;base64,${base64String}`;
};

onMounted(async () => {
    try {
        const gameId = props.id;
        const response = await fetch(`/api/game/${gameId}`);
        const data = await response.json();
        game.value = data[0];

        const reviewsResponse = await fetch(`/api/reviews/game/${gameId}`);
        if (reviewsResponse.ok) {
            reviews.value = await reviewsResponse.json();
        } else {
            console.error('Failed to fetch reviews:', reviewsResponse.statusText);
        }
    } catch (error) {
        console.error('There was a problem with the loading of the game:', error);
    } finally {
        loading.value = false;
    }
});

</script>
<template>
    <div v-if="!loading && game" class="game-detail-page">
        <main class="content-wrapper">
            <aside class="left-column">
                <img :src="getImageUrl(game.gameCoverBin)" :alt="game.gameName" class="game-cover" />

                <div class="rating-container">
                    <p class="rating-label">Rating: {{ Math.floor(game.gameRating) }} / 5</p>
                    <StarRating :rating="Math.floor(game.gameRating)" :size="10" />
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
            </aside>

            <div class="right-column">
                <h2 class="game-title">{{ game.gameName }}</h2>


                <p class="game-release-date">{{ moment(game.gameReleaseDate).format('DD/MM/YYYY') }}</p>
                <p class="game-description">{{ game.gameDesc }}</p>


            </div>

        </main>
        <section class="review-section" v-if="isLoggedIn">
            <button class="review-btn" @click="showReviewModal = true">Write your review</button>
        </section>
        <p v-else class="login-prompt">Please log in from the navigation bar to add a review.</p>

        <section class="reviews-list-section" v-if="reviews.length > 0">
            <h2>User Reviews</h2>
            <div v-for="(review, index) in reviews" :key="index" class="review-card">
                <img :src="getImageUrl(review.userIconBin)" alt="User Icon" class="user-icon" />
                <p class="username">{{ review.userUsername }}</p>
                <h2 class="review-title">{{ review.reviewTitle }}</h2>
                <div class="rating-container">
                    <p class="rating-label">Rating: {{ review.reviewRating }} / 5</p>
                    <StarRating :rating="review.reviewRating" :size="10" />
                </div>
                <p class="review-date">{{ moment(review.reviewTimeStamp).format('MMMM Do YYYY, h:mm:ss a') }}</p>
                <p class="review-content">{{ review.reviewBody }}</p>
            </div>
        </section>

        <div v-if="showReviewModal" class="modal-overlay" @click="showReviewModal = false">
            <div class="review-modal" @click.stop>
                <h2>Write your review</h2>
                <form @submit.prevent="submitReview">
                    <input v-model="reviewData.reviewTitle" id="review-title" type="text" placeholder="Review Title"
                        required />

                    <div class="rating-input">
                        <label for="review-rating">Rating(1-5):</label>
                        <select id="review-rating" v-model.number="reviewData.reviewRating" type="number" min="1"
                            max="5" required>
                            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                        </select>
                    </div>

                    <label for="review-content">Content:</label>
                    <textarea id="review-content" v-model="reviewData.reviewBody" placeholder="Your review..." rows="5"
                        required></textarea>

                    <div class="modal-actions">
                        <button @click="submitReview">Submit Review</button>
                        <button @click="showReviewModal = false">Cancel</button>
                    </div>

                </form>
            </div>
        </div>
    </div>
    <div v-else>
        <p>Loading...</p>
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
}

.right-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.game-title {
    font-size: 3.5rem;
    font-weight: 500;
    color: style-variables.$default-text-color;
    margin: 0;
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
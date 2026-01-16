<script setup>
defineProps({
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    size: {
        type: Number,
        required: true,
        default: 30
    }
});
</script>
<template>
    <div class="star-rating-container">
        <svg style="display: none;">
            <symbol id="star-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </symbol>
        </svg>
    </div>

    <div class="stars-flex">
        <svg
            v-for="n in 5"
            :key="n"
            class="star-icon"
            :class="{'is-active':n <= rating}"
        >
            <use xlink:href="#star-icon" />
        </svg>    
    </div>
</template>

<style scoped lang="scss">
    @use "../styles/style-variables.scss" as style-variables;

    .stars-flex{
        display: flex;
        gap: 4px;
        margin: 15px 0;
    }
    .star-icon{
        fill: transparent;
        stroke: style-variables.$color-star-rating;
        width: 30px;
        height: 30px;
        stroke-width: 4px;
        stroke-linejoin: round;
    }

    .star-icon.is-active{
        fill: style-variables.$color-star-rating;
        stroke: none;
    }
</style>
<script>
    import { ref, onMounted } from 'vue';
    import StarRating from '../components/StarRating.vue';

</script>
<template>
    <div v-if="true" class="game-detail-page">
        <main class="content-wrapper">
            <img src="#" alt="game cover" class="game-cover" />
            <h2 class="game-title">Game Title</h2>

            <StarRating :rating="4" :size="30" /> <!-- this is only an example-->

            <p class="game-description">Description of the game</p>

            <div class="avaible-container">
                <h3>Avaible on:</h3>
                <ul>
                    <li><img src='../assets/avaibleIcons/SteamLogo.svg' alt="Steam Logo" /></li>
                    <li><img src='../assets/avaibleIcons/GogLogo.svg' alt="Gog Logo" /></li>
                    <li><img src='../assets/avaibleIcons/EpicGamesLogo.svg' alt="Epic Games Logo" /></li>
                </ul>
            </div>

        </main>

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
    display: flex;
    flex-direction: column;
    background-color: style-variables.$default-background-color;
    overflow-y: auto;
}

.game-title {
    font-size: 3rem;
    color: style-variables.$primary-text-color;
}

.game-description {
    font-size: 1.5rem;
    color: style-variables.$secondary-text-color;
}

.content-wrapper {
    margin: 0 auto;
    max-width: 1200px;
    padding: 0 20px;
    padding-bottom: 3%;
}
</style>
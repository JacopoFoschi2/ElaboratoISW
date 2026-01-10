<script>

</script>
<template>
    <div class="game-detail-page">
        <main class="content-wrapper">
            <img src="#" alt="game cover" />
            <h2 class="game-title">Game Title</h2>

            <p class="game-description">Description of the game</p>


        </main>

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
<script setup>
    
</script>

<template>
    <div class="homepage">
        <main class="content-wrapper">
            <div class="search-container">
                <input type="text" placeholder="search your games..." class="search-input" />
                <button class="search-button">
                    <img src="../assets/search.svg" alt="search icon" />
                </button>

            </div>
            <h2 class="section-title">Action</h2>
            <div class="game-section">
                <div class="game-card">
                    <!-- Here the list of the games -->
                </div>
                <div class="game-card">
                    <!-- Here the list of the games -->
                </div>
                <div class="game-card">
                    <!-- Here the list of the games -->
                </div>
                <div class="game-card">
                    <!-- Here the list of the games -->
                </div>
                <div class="game-card">
                    <!-- Here the list of the games -->
                </div>
            </div>
            <h2 class="section-title">Shooter</h2>
            <div class="game-section">
                <div class="game-card">
                    <!-- Here the list of the games -->
                </div>
                <div class="game-card">
                    <!-- Here the list of the games -->
                </div>
                <div class="game-card">
                    <!-- Here the list of the games -->
                </div>
                <div class="game-card">
                    <!-- Here the list of the games -->
                </div>
                <div class="game-card">
                    <!-- Here the list of the games -->
                </div>
            </div>
        </main>

    </div>

</template>
<script>


</script>

<style scoped lang="scss">
    @use "../styles/style-variables.scss" as style-variables;

.homepage {
    margin: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: style-variables.$default-background-color;
    overflow-y: auto;
}

.content-wrapper {
    margin: 0 auto;
    max-width: 1200px;
    padding: 0 20px;
    padding-bottom: 3%;
}

.search-container{
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    width: 60%;
    margin: 40px auto 20px auto;
    background-color: style-variables.$default-navbar-color;

    .search-input{
        flex: 1;
        border: none;
        background-color: transparent;
        font-size: 1rem;
        outline: none;
        padding: 10px 15px;
    }
    .search-button{
        padding: 0px 15px;
        border: none;
        background-color: transparent;
        justify-content: center;
        align-items: center;
        display: flex;
        cursor: pointer;
    }
}

.section-title {
    padding-top: 5%;
    padding-bottom: 1%;
    font-size: 2rem;
}

.game-section {
    display: flex;
    justify-content: space-between;
    padding-bottom: 2%;
    gap: 15px;
    width: 100%;
}

.game-card {
    width: 19.2%;
    height: auto;
    aspect-ratio: 2/3;
    object-fit: cover;
    background-color: style-variables.$default-text-color;
    overflow: hidden;
    transition: transform 0.3s;
    min-width: 228px;
    min-height: 342px;
}

.game-card:hover {
    transform: scale(1.05);
}
</style>
<template>
    <div class="homepage">

        <h1>THE HOME PAGE</h1>

        <main class="content-wrapper">
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
        </main>
        
    </div>
    
</template>
<script>


</script>

<style scoped>
    .homepage {
        margin: 0;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background-color: #270c37;
        overflow-y: auto;
    }
    .content-wrapper {
        margin : 0 auto;
        max-width: 1200px;
        padding: 0 20px;
    }
    .section-title {
        padding-top: 5%;
        font-size: 2rem;
    }
    .game-section {
        display: flex;
        justify-content: space-between;
        gap: 15px;
        width: 100%;
    }
    .game-card {
        width: 19.2%;
        height: auto;
        aspect-ratio: 2/3;
        object-fit: cover;
        background-color: #ffffff;
        overflow: hidden;
        transition: transform 0.3s;
        min-width: 228px;
        min-height: 342px;
    }
    .game-card:hover {
        transform: scale(1.05);
    }
    
</style>
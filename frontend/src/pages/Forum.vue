<template>
    <div class="forum-page">
        <main class="content-wrapper">
            <h2>All Forums</h2>
            <div class="search-container">
                <input type="text" placeholder="search your games..." class="search-input" />
                <button class="search-button">
                    <img src="../assets/search.svg" alt="search icon" />
                </button>
            </div>

            <div class="forum-list">
                <div class="forum-card">
                    <img class="image-forum" src="../assets/dragon-age-forum.jpg"></img>
                    <p class="game-title">Dragon Age™: Origins - Ultimate Edition</p>
                </div>
            </div>
        </main>

    </div>

</template>
<script>


</script>

<style scoped lang="scss">
@use "../styles/style-variables.scss" as style-variables;

.forum-page {
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
    align-items: center;
}

h2 {
    font-size: 2.5rem;
    padding-top: 10%;
}

.search-container {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    width: 60%;
    margin: 40px auto 20px auto;
    background-color: style-variables.$default-navbar-color;

    .search-input {
        flex: 1;
        border: none;
        background-color: transparent;
        font-size: 1rem;
        outline: none;
        padding: 10px 15px;
        color: style-variables.$default-text-color;
    }


    .search-button {
        padding: 0px 15px;
        border: none;
        background-color: transparent;
        justify-content: center;
        align-items: center;
        display: flex;
        cursor: pointer;
    }
}

.forum-list {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 2%;
}

.forum-card {
    display: flex;
    align-items: center;
    border: 1px solid style-variables.$default-text-color;
    background-color: transparent;
    cursor: pointer;
}

.image-forum {
    margin-right: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    max-width: 231px;
    max-height: 87px;
    object-fit: cover;
}

.game-title {
    font-size: 1.5rem;
    padding-right: 10px;
}
</style>
<template>
    <div class="forum-page">
        <main class="content-wrapper">
            <div class="search-container">
                <input type="text" placeholder="search your games..." class="search-input" />
                <button class="search-button">
                    <img src="../assets/search.svg" alt="search icon" />
                </button>

            </div>
            <h2>All Forums</h2>
            
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
}

.search-container{
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    width: 60%;
    margin: 40px auto 20px auto;
    background-color: style-variables.$button-and-border-footer-color;
    border: 1px solid style-variables.$default-text-color;

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


</style>
<template>
  <div class="content-not-found">
    <h2>404</h2>
    <h3>Page not found</h3>
    <p>The page doesn't exists or it has been moved, please return to the <router-link to="/">homepage</router-link>.</p>
  </div>

</template>
<style scoped lang="scss">
@use "../styles/style-variables.scss" as style-variables;
.content-not-found {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
h2 {
  font-size: 100px;
}

h3 {
  font-size: 50px;
}

p{
  font-size: 30px;
}

a{
  color: style-variables.$default-text-color;
  text-decoration: underline;
  font-weight: bold;
}


</style>
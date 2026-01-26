<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <router-link to="/super-admin/users">Users</router-link>
      <router-link to="/super-admin/games">Games</router-link>
      <router-link to="/super-admin/categories">Categories</router-link>
      <router-link to="/super-admin/forums">Forums</router-link>
    </aside>

    <main class="admin-content">
      <router-view />
    </main>
  </div>
</template>
<style scoped lang="scss">
@use "../styles/style-variables.scss" as vars;

.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: vars.$default-background-color;
}

.sidebar {
  width: 240px;
  background-color: vars.$default-navbar-color;
  display: flex;
  flex-direction: column;
  padding: 30px 20px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  border-top:3px solid vars.$button-and-border-footer-color;

  a {
    color: black;
    text-decoration: none;
    padding: 12px 15px;
    margin-bottom: 10px;
    border-radius: 6px;
    font-weight: 500;
    transition: background-color 0.2s ease, transform 0.1s ease;

    &:hover {
      background-color: vars.$button-and-border-footer-color;
      color: vars.$default-text-color;
      transform: translateX(4px);
    }

    &.router-link-active {
      background-color: vars.$button-and-border-footer-color;
      color: vars.$default-text-color;
      font-weight: 600;
    }
  }
}

.admin-content {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
}
</style>

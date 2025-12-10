import { createApp } from "vue"
import { createRouter, createWebHistory, Router } from "vue-router"
// import "./style.css"
import App from "./App.vue"
import Home from "./pages/Home.vue"
import NotFound from "./pages/NotFound.vue"

const router: Router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: Home },
        { path: "/:pathMatch(.*)*", component: NotFound }
    ]
})

createApp(App).use(router)
.mount("#app")
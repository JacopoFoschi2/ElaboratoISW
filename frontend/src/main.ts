import { createApp } from "vue"
import { createRouter, createWebHistory, Router } from "vue-router"
import "./style.css"
import App from "./App.vue"
import Home from "./pages/Home.vue"
import NotFound from "./pages/NotFound.vue"
import PrivacyPolicy from "./pages/Privacy-Policy.vue"


const router: Router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: Home },
        { path: "/privacy-policy", component: PrivacyPolicy },
        { path: "/:pathMatch(.*)*", component: NotFound }
    ]
})

createApp(App)
    .use(router)
    .mount("#app")
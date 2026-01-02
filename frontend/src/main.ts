import { createApp } from "vue"
import { createRouter, createWebHistory, Router } from "vue-router"
import App from "./App.vue"
import Home from "./pages/Home.vue"
import NotFound from "./pages/NotFound.vue"
import PrivacyPolicy from "./pages/Privacy-Policy.vue"
import Forum from "./pages/Forum.vue"
import TermsOfService from "./pages/Terms-of-Service.vue"
import CommunityGuidelines from "./pages/Community-Guidelines.vue"
import CookiePolicy from "./pages/Cookie-Policy.vue"



const router: Router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: Home },
        { path: "/forum", component: Forum },
        { path: "/privacy-policy", component: PrivacyPolicy },
        {path: "/terms-of-service", component: TermsOfService},
        {path: "/Community-Guidelines", component: CommunityGuidelines},
        { path: "/cookie-policy", component: CookiePolicy },
        { path: "/:pathMatch(.*)*", component: NotFound }
    ]
})

createApp(App)
    .use(router)
    .mount("#app")
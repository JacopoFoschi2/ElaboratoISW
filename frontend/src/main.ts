import { createApp } from "vue"
import { createPinia } from "pinia"
import { createRouter, createWebHistory, Router } from "vue-router"
import App from "./App.vue"
import Home from "./pages/Home.vue"
import NotFound from "./pages/NotFound.vue"
import PrivacyPolicy from "./pages/Privacy-Policy.vue"
import Forum from "./pages/Forum.vue"
import TermsOfService from "./pages/Terms-of-Service.vue"
import CommunityGuidelines from "./pages/Community-Guidelines.vue"
import CookiePolicy from "./pages/Cookie-Policy.vue"
import CategoryGames from "./pages/CategoryGames.vue"
import { useAuthStore } from './stores/auth';

const router: Router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: Home },
        { path: "/forum", component: Forum },
        {
            path: "/category/:id",
            name: "CategoryGames",
            component: () => import('./pages/CategoryGames.vue'),
            props: route => ({ id: Number(route.params.id) })
        },
        {
            path: "/game/:id",
            name: "GameDetail",
            component: () => import('./pages/GameDetail.vue'),
            props: route => ({ id: Number(route.params.id) })
        },
        {
            path: "/best-games",
            name: "BestGames",
            component: () => import('./pages/BestGames.vue')
        },
        {
            path: "/recently-released",
            name: "RecentlyReleased",
            component: () => import('./pages/RecentlyReleased.vue')
        },
        {
            path: "/profile/:id",
            component: () => import('./pages/Profile.vue'),
            props: route => ({ id: Number(route.params.id) })
        },
        {
            path: "/forum/game/:id",
            name: "ForumDetail",
            component: () => import('./pages/ForumDetail.vue'),
            props: route => ({ id: Number(route.params.id) })
        },
        {
            path: "/registration", 
            component: () => import('./pages/Registration.vue')
        },
        {
            path: "/reset-password", 
            component: () => import('./pages/ResetPassword.vue')
        },
        { path: "/privacy-policy", component: PrivacyPolicy },
        { path: "/terms-of-service", component: TermsOfService },
        { path: "/community-guidelines", component: CommunityGuidelines },
        { path: "/cookie-policy", component: CookiePolicy },
        { path: "/:pathMatch(.*)*", component: NotFound }
    ]
})
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)


localStorage.clear();
sessionStorage.clear();

localStorage.removeItem('user');
localStorage.removeItem('token');
localStorage.removeItem('auth');

const authStore = useAuthStore(pinia);
authStore.setLogout(); 

if (window.location.pathname !== '/') {
    window.location.href = '/';
} else {
    app.use(router)
    app.mount('#app')
}
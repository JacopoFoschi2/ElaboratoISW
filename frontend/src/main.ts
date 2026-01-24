import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import Home from "./pages/Home.vue";
import NotFound from "./pages/NotFound.vue";
import PrivacyPolicy from "./pages/Privacy-Policy.vue";
import Forum from "./pages/Forum.vue";
import TermsOfService from "./pages/Terms-of-Service.vue";
import CommunityGuidelines from "./pages/Community-Guidelines.vue";
import CookiePolicy from "./pages/Cookie-Policy.vue";
import { useAuthStore } from "./stores/auth";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: Home },
        { path: "/forum", component: Forum },
        {
            path: "/category/:id",
            name: "CategoryGames",
            component: () => import("./pages/CategoryGames.vue"),
            props: route => ({ id: Number(route.params.id) })
        },
        {
            path: "/game/:id",
            name: "GameDetail",
            component: () => import("./pages/GameDetail.vue"),
            props: route => ({ id: Number(route.params.id) })
        },
        {
            path: "/best-games",
            component: () => import("./pages/BestGames.vue")
        },
        {
            path: "/recently-released",
            component: () => import("./pages/RecentlyReleased.vue")
        },
        {
            path: "/profile/:id",
            component: () => import("./pages/Profile.vue"),
            props: route => ({ id: Number(route.params.id) }),
            meta: { requiresAuth: true }
        },
        {
            path: "/forum/game/:id",
            component: () => import("./pages/ForumDetail.vue"),
            props: route => ({ id: Number(route.params.id) })
        },
        {
            path: "/registration",
            component: () => import("./pages/Registration.vue")
        },
        {
            path: "/reset-password",
            component: () => import("./pages/ResetPassword.vue")
        },
        { path: "/privacy-policy", component: PrivacyPolicy },
        { path: "/terms-of-service", component: TermsOfService },
        { path: "/community-guidelines", component: CommunityGuidelines },
        { path: "/cookie-policy", component: CookiePolicy },
        { path: "/:pathMatch(.*)*", component: NotFound }
    ]
});

router.beforeEach((to, from, next) => {
    const auth = useAuthStore();

    if (to.meta.requiresAuth && !auth.isLoggedIn) {
        next('/');
    } else {
        next();
    }
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);


const authStore = useAuthStore();
authStore.loadUser().finally(() => {
    app.use(router);
    app.mount('#app');
});

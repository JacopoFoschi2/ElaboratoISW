import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "./stores/auth";
import App from "./App.vue";
import Home from "./pages/Home.vue";
import NotFound from "./pages/NotFound.vue";
import PrivacyPolicy from "./pages/Privacy-Policy.vue";
import Forum from "./pages/Forum.vue";
import TermsOfService from "./pages/Terms-of-Service.vue";
import CommunityGuidelines from "./pages/Community-Guidelines.vue";
import CookiePolicy from "./pages/Cookie-Policy.vue";
import SuperAdminPanel from "./pages/SuperAdminPanel.vue";
import BestGames from "./pages/BestGames.vue";
import UsersAdmin from "./pages/UsersAdmin.vue";
import GamesAdmin from "./pages/GamesAdmin.vue";
import CategoriesAdmin from "./pages/CategoriesAdmin.vue";
import ForumsAdmin from "./pages/ForumsAdmin.vue";
import GameDetail from "./pages/GameDetail.vue";
import CategoryGames from "./pages/CategoryGames.vue";
import RecentlyReleased from "./pages/RecentlyReleased.vue";
import Profile from "./pages/Profile.vue";
import WishListProfile from "./pages/WishListProfile.vue";
import OwnedGames from "./pages/OwnedGames.vue";
import ForumDetail from "./pages/ForumDetail.vue";
import Registration from "./pages/Registration.vue";
import ResetPassword from "./pages/ResetPassword.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: Home },
        { path: "/forum", component: Forum },
        {
            path: "/category/:id",
            name: "CategoryGames",
            component: CategoryGames,
            props: route => ({ id: Number(route.params.id) })
        },
        {
            path: "/game/:id",
            name: "GameDetail",
            component: GameDetail,
            props: route => ({ id: Number(route.params.id) })
        },
        {
            path: "/best-games",
            component: BestGames
        },
        {
            path: "/recently-released",
            component: RecentlyReleased
        },
        {
            path: "/profile/:id",
            component: Profile,
            props: route => ({ id: Number(route.params.id) }),
            meta: { requiresAuth: true }
        },
        {
            path: "/wishlist/:id",
            component: WishListProfile,
            props: route => ({ id: Number(route.params.id) }),
            meta: { requiresAuth: true }
        },
        {
            path: "/owned/:id",
            component: OwnedGames,
            props: route => ({ id: Number(route.params.id) }),
            meta: { requiresAuth: true }
        },
        {
            path: "/super-admin",
            component: SuperAdminPanel,
            meta: { requiresAuth: true, role: 'master' },
            children: [
                { path: 'users', component: UsersAdmin },
                { path: 'games', component: GamesAdmin },
                { path: 'categories', component: CategoriesAdmin },
                { path: 'forums', component: ForumsAdmin },
            ]
        },
        {
            path: "/forum/game/:id",
            component: ForumDetail,
            props: route => ({ id: Number(route.params.id) })
        },
        {
            path: "/registration",
            component: Registration
        },
        {
            path: "/reset-password",
            component: ResetPassword
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

    if (to.meta.requiresAuth && !authStore.user) {
        return next('/login');
    }

    if (to.meta.role && authStore.user?.userRole !== to.meta.role) {
        return next('/');
    }

    if (to.meta.requiresAuth && !auth.isLoggedIn) {
        next('/');
    }
    next();



});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);


const authStore = useAuthStore();
authStore.loadUser().finally(() => {
    app.use(router);
    app.mount('#app');
});

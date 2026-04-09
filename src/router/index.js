import { createRouter, createWebHistory } from 'vue-router';
import BlogIndex from '../components/BlogIndex.vue';
import BlogPost from '../components/BlogPost.vue';
import Home from '../components/Home.vue'; // Importe o componente Home

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/blog',
        name: 'BlogIndex',
        component: BlogIndex,
    },
    {
        path: '/blog/:postId',
        name: 'BlogPost',
        component: BlogPost,
        props: true,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(_to, _from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }

        return { top: 0 };
    },
});

export default router;

import { createRouter, createWebHistory } from 'vue-router';
import BlogIndex from '../components/BlogIndex.vue';
import BlogPost from '../components/BlogPost.vue';
import Home from '../components/Home.vue';
import PortfolioIndex from '../components/PortfolioIndex.vue';
import PortfolioItem from '../components/PortfolioItem.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            title: 'Bunga António | Portfólio',
        },
    },
    {
        path: '/blog',
        name: 'BlogIndex',
        component: BlogIndex,
        meta: {
            title: 'Blog | Bunga António',
        },
    },
    {
        path: '/blog/:postId',
        name: 'BlogPost',
        component: BlogPost,
        props: true,
        meta: {
            title: 'Post | Bunga António',
        },
    },
    {
        path: '/portfolio',
        name: 'PortfolioIndex',
        component: PortfolioIndex,
        meta: {
            title: 'Portfólio | Bunga António',
        },
    },
    {
        path: '/portfolio/:itemId',
        name: 'PortfolioItem',
        component: PortfolioItem,
        props: true,
        meta: {
            title: 'Projeto | Bunga António',
        },
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

const defaultTitle = 'Bunga António @ Software & System Engineer';
router.afterEach((to) => {
    if (typeof document !== 'undefined') {
        document.title = to.meta.title || defaultTitle;
    }
});

export default router;

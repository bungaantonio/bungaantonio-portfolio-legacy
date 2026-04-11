<template>
    <header id="banner" class="bg-card-bg shadow-md sticky top-0 z-10">
        <div class="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div class="name-logo">
                <router-link to="/" class="flex items-center" aria-label="Página inicial">
                    <img src="/bungaantonio.jpg" alt="Bunga António"
                        class="w-12 h-12 rounded-full mx-auto border-4 border-primary shadow-md" />
                </router-link>
            </div>
            <div class="hidden md:block space-x-4">
                <router-link to="/" class="text-secondary hover:text-primary" aria-label="Ir para a home">Home</router-link>
                <router-link to="/blog" class="text-secondary hover:text-primary" aria-label="Ir para o blog">Blog</router-link>
            </div>
            <div class="md:hidden">
                <button @click="toggleMenu" class="text-secondary hover:text-primary focus:outline-none" aria-label="Abrir menu" :aria-expanded="menuOpen" aria-controls="mobile-nav">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Menu Responsivo -->
        <div v-if="menuOpen" id="mobile-nav" class="md:hidden bg-card-bg shadow-md transition-all ease-in-out duration-300">
            <router-link to="/" class="block px-4 py-2 text-secondary hover:text-primary" @click="closeMenu" aria-label="Ir para a home">Home</router-link>
            <router-link to="/blog" class="block px-4 py-2 text-secondary hover:text-primary" @click="closeMenu" aria-label="Ir para o blog">Blog</router-link>
        </div>
    </header>
</template>

<script>
export default {
    data() {
        return {
            menuOpen: false,
        };
    },
    methods: {
        toggleMenu() {
            this.menuOpen = !this.menuOpen;
        },
        closeMenu() {
            this.menuOpen = false;
        },
    },
    watch: {
        '$route.fullPath'() {
            this.closeMenu();
        },
    },
};
</script>

<style scoped>
#mobile-nav {
    transform: translateY(0);
}
</style>

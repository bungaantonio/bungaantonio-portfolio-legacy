<template>
    <header id="banner" class="bg-card-bg dark:bg-card-bg-dark shadow-md sticky top-0 z-10 border-b border-secondary-200 dark:border-secondary-700 transition-colors duration-400">
        <div class="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div class="flex items-center space-x-4">
                <router-link to="/" class="flex items-center" aria-label="Página inicial">
                    <img src="/bungaantonio.jpg" alt="Bunga António"
                        class="w-12 h-12 rounded-full mx-auto border-4 border-primary shadow-md transition-transform duration-200 hover:scale-105" />
                </router-link>
                <div class="hidden md:flex flex-col">
                    <span class="text-sm font-semibold text-secondary dark:text-secondary-100">Bunga António</span>
                    <span class="text-xs text-muted dark:text-secondary-400">Software & Systems Engineer</span>
                </div>
            </div>
            <div class="hidden md:flex items-center space-x-4">
                <router-link to="/" class="text-secondary dark:text-secondary-200 hover:text-primary dark:hover:text-primary-400 transition-colors duration-200" aria-label="Ir para a home">Home</router-link>
                <router-link to="/blog" class="text-secondary dark:text-secondary-200 hover:text-primary dark:hover:text-primary-400 transition-colors duration-200" aria-label="Ir para o blog">Blog</router-link>
                <button @click="toggleDarkMode" class="p-2 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors duration-200" aria-label="Alternar modo escuro">
                    <svg v-if="!isDark" class="w-5 h-5 text-secondary dark:text-secondary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                    </svg>
                    <svg v-else class="w-5 h-5 text-secondary dark:text-secondary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                </button>
            </div>
            <div class="md:hidden flex items-center space-x-2">
                <button @click="toggleDarkMode" class="p-2 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors duration-200" aria-label="Alternar modo escuro">
                    <svg v-if="!isDark" class="w-5 h-5 text-secondary dark:text-secondary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                    </svg>
                    <svg v-else class="w-5 h-5 text-secondary dark:text-secondary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                </button>
                <button @click="toggleMenu" class="text-secondary dark:text-secondary-200 hover:text-primary dark:hover:text-primary-400 focus:outline-none transition-colors duration-200" aria-label="Abrir menu" :aria-expanded="menuOpen" aria-controls="mobile-nav">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Menu Responsivo -->
        <div v-if="menuOpen" id="mobile-nav" class="md:hidden bg-card-bg dark:bg-card-bg-dark shadow-md transition-all ease-in-out duration-300 border-t border-secondary-200 dark:border-secondary-700">
            <router-link to="/" class="block px-4 py-2 text-secondary dark:text-secondary-200 hover:text-primary dark:hover:text-primary-400 transition-colors duration-200" @click="closeMenu" aria-label="Ir para a home">Home</router-link>
            <router-link to="/blog" class="block px-4 py-2 text-secondary dark:text-secondary-200 hover:text-primary dark:hover:text-primary-400 transition-colors duration-200" @click="closeMenu" aria-label="Ir para o blog">Blog</router-link>
        </div>
    </header>
</template>

<script>
export default {
    data() {
        return {
            menuOpen: false,
            isDark: false,
        };
    },
    mounted() {
        // Verificar preferência do usuário
        this.isDark = localStorage.getItem('darkMode') === 'true';
        this.updateDarkMode();
    },
    methods: {
        toggleMenu() {
            this.menuOpen = !this.menuOpen;
        },
        closeMenu() {
            this.menuOpen = false;
        },
        toggleDarkMode() {
            this.isDark = !this.isDark;
            localStorage.setItem('darkMode', this.isDark);
            this.updateDarkMode();
        },
        updateDarkMode() {
            if (this.isDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
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

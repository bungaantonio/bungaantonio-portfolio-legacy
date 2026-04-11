<template>
    <main class="w-full section-spacing">
        <div class="container mx-auto px-4 sm:px-6">
            <div class="max-w-4xl mx-auto component-spacing">
                <section class="intro flex flex-col md:flex-row items-start mt-12 gap-10">

                    <!-- Coluna de Conteúdo -->
                    <section class="md:w-3/5">
                        <h1 class="text-title mb-6">Bem-vindo ao meu portfólio.</h1>

                        <p class="mb-4 text-body leading-relaxed">
                            Atuo na intersecção entre desenvolvimento, operação e arquitetura. Minha prática é
                            pautada pela <span class="text-secondary-900 dark:text-white font-medium">consistência em
                                produção</span> e pela responsabilidade técnica em sistemas de elevado impacto.
                        </p>

                        <p class="text-body leading-relaxed mb-8">
                            Tenho interesse especial por sistemas organizacionais e de elevado fluxo, onde regras,
                            integração e clareza operacional precisam funcionar em ambiente real.
                        </p>

                        <!-- System Grid: Especialidades -->
                        <div class="mt-5">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <article v-for="item in domains" :key="item.title" class="system-grid__card group">
                                    <h3 class="system-grid__card-title">{{ item.title }}</h3>
                                </article>
                            </div>
                        </div>
                    </section>

                    <!-- Coluna de Perfil -->
                    <aside class="photo md:w-2/5 w-full flex flex-col items-center md:items-end">
                        <div class="image-container relative">
                            <img alt="Bunga António, engenheiro de software e sistemas" src="/bungaantonio-brand.jpeg"
                                class="rounded-lg shadow-lg border border-secondary-200 dark:border-secondary-700 object-cover"
                                loading="lazy" width="400" height="400" />
                            <div class="profile-caption">
                                <p class="mf-name">bunga.antonio</p>
                                <p class="credit">FEUAN • 2024/2025</p>
                            </div>
                        </div>
                    </aside>
                </section>

                <!-- Footer / CTA -->
                <div class="mt-16 pt-8 border-t border-accent dark:border-secondary-800 text-center">
                    <p class="text-body text-lg">
                        Veja meus
                        <router-link to="/blog" class="link font-semibold mx-1">artigos técnicos</router-link>
                        ou
                        <a href="https://www.linkedin.com/in/bungaantonio" target="_blank" rel="noopener noreferrer"
                            class="link font-semibold mx-1">
                            conecte-se comigo
                        </a>.
                    </p>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
const domains = [
    { title: 'IAM & Identidade' },
    { title: 'Rastreabilidade & Auditoria' },
    { title: 'Processos & Regras de Negócio' },
    { title: 'Infra & Integração' },
];
</script>

<style scoped>
.photo img {
    max-width: 100%;
    height: auto;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.photo img:hover {
    transform: translateY(-4px);
    @apply shadow-xl;
}

.profile-caption {
    @apply absolute bottom-3 left-3 rounded-lg border border-white/10 bg-secondary-900/60 px-3 py-2 text-left shadow-lg backdrop-blur-md;
}

.mf-name {
    @apply text-xs font-semibold tracking-[0.16em] text-white/95;
}

.credit {
    @apply mt-1 text-[9px] uppercase tracking-[0.22em] text-white/60;
}

.system-grid__card {
    @apply rounded-xl border border-secondary-200 bg-secondary-50/50 px-4 py-4 transition-all duration-300 ease-in-out hover:border-primary-400 hover:bg-white hover:shadow-md dark:border-secondary-700 dark:bg-secondary-800/50 dark:hover:border-primary-500 dark:hover:bg-secondary-800;
}

.system-grid__card-title {
    @apply text-[13px] font-bold leading-tight uppercase tracking-wide text-secondary-700 dark:text-secondary-200;
}

/* Ajuste sutil para os links não "pularem" no hover */
.link {
    @apply border-b border-transparent transition-all duration-300;
}

.link:hover {
    color: theme('colors.primary.DEFAULT');
    @apply border-primary-500;
}
</style>

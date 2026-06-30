<template>
    <main class="w-full section-spacing">
        <div class="container mx-auto px-4 sm:px-6">
            <div class="max-w-4xl mx-auto component-spacing">
                <section class="intro flex flex-col md:flex-row items-start mt-12 gap-10">

                    <section class="md:w-3/5">
                        <h1 class="text-title mb-6">Bem-vindo. Estou a construir a minha trajetória na área de infraestrutura, sistemas e operação tecnológica.</h1>

                        <p class="mb-4 text-body leading-relaxed">
                            Atualmente, estou a iniciar o percurso como <strong>IT Infrastructure Engineer</strong>, com foco em aprendizagem prática e consolidação de bases 
                            em ambientes on-prem. Trabalho em troubleshooting e suporte operacional em infraestruturas de sistemas, com atenção à estabilidade, resolução de incidentes 
                            e continuidade de serviço.
                        </p>

                        <p class="text-body leading-relaxed mb-8">
                            Tenho interesse especial em virtualização, automação de infraestruturas, administração de redes, segurança operacional, 
                            fiabilidade de sistemas e integração entre infraestrutura e aplicações. Desenvolvo uma abordagem prática, orientada à operação, estabilidade, 
                            observabilidade e continuidade de serviço.
                        </p>

                        <div class="mt-5">
                            <h2 class="section-label mb-3">Áreas de interesse</h2>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <article v-for="item in domains" :key="item.title" class="system-grid__card">
                                    <h3 class="system-grid__card-title">{{ item.title }}</h3>
                                    <p class="system-grid__card-desc">{{ item.description }}</p>
                                </article>
                            </div>
                        </div>
                    </section>

                    <aside class="photo md:w-2/5 w-full flex flex-col items-center md:items-end">
                        <div class="image-container relative">
                            <img alt="Bunga António, engenheiro informático" :src="profileImage"
                                class="rounded-lg shadow-lg border border-secondary-200 dark:border-secondary-700 object-cover"
                                loading="lazy" width="400" height="400" />
                            <div class="profile-caption">
                                <p class="mf-name">bunga.antonio</p>
                                <p class="credit">FEUAN • 2024/2025</p>
                            </div>
                        </div>
                    </aside>
                </section>

                <section class="mt-12">
                    <h2 class="section-label mb-1">AMBIENTE TÉCNICO</h2>
                    <p class="text-body text-sm mb-4 text-secondary-600 dark:text-secondary-400">Áreas em que estou a ganhar experiência, aprender e consolidar a minha base técnica.</p>
                    <div class="tech-grid">
                        <div v-for="group in technologies" :key="group.label" class="tech-grid__group">
                            <h3 class="tech-grid__label">{{ group.label }}</h3>
                            <p class="tech-grid__items">{{ group.items.join(', ') }}</p>
                        </div>
                    </div>
                </section>

                <section v-if="featuredProjects.length" class="mt-16">
                    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
                        <div>
                            <h2 class="text-xl font-bold text-secondary dark:text-secondary-100">Casos de estudo</h2>
                            <p class="text-body mt-1">Os projectos documentados até agora. A lista actualiza-se conforme novos sistemas forem concluídos.</p>
                        </div>
                        <router-link to="/portfolio" class="link font-semibold text-sm">
                            Ver portfólio completo &rarr;
                        </router-link>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <article
                            v-for="project in featuredProjects"
                            :key="project.id"
                            class="featured-card"
                        >
                            <div class="flex items-start justify-between gap-3 mb-3">
                                <h3 class="featured-card__title">
                                    <router-link :to="`/portfolio/${project.id}`" class="link">
                                        {{ displayTitle(project) }}
                                    </router-link>
                                </h3>
                                <span
                                    v-if="project.category"
                                    class="featured-badge"
                                    :class="project.category === 'academia' ? 'featured-badge--academia' : 'featured-badge--corporativo'"
                                >
                                    {{ project.category === 'academia' ? 'Academia' : 'Corporativo' }}
                                </span>
                            </div>

                            <div v-if="project.stack.length" class="mb-3 flex flex-wrap gap-1.5">
                                <span
                                    v-for="tech in project.stack.slice(0, 4)"
                                    :key="tech"
                                    class="stack-chip"
                                >
                                    {{ tech }}
                                </span>
                                <span v-if="project.stack.length > 4" class="stack-chip stack-chip--more">
                                    +{{ project.stack.length - 4 }}
                                </span>
                            </div>

                            <p class="text-body text-sm leading-relaxed mb-4">
                                {{ project.excerpt || project.description }}
                            </p>

                            <router-link :to="`/portfolio/${project.id}`" class="link font-semibold text-sm">
                                Ler caso de estudo
                            </router-link>
                        </article>
                    </div>
                </section>

                <div class="mt-16 pt-8 border-t border-accent dark:border-secondary-800 text-center space-y-4">
                    <p class="text-body text-base max-w-2xl mx-auto leading-relaxed">
                        Profissional em início de percurso em infraestruturas de TI, com foco em automação, resiliência, segurança operacional e estabilidade de serviços, 
                        a aprofundar a minha evolução no alinhamento entre infraestruturas e sistemas.
                    </p>
                    <p class="text-body text-lg">
                        Explore os meus
                        <router-link to="/portfolio" class="link font-semibold mx-1">casos de estudo</router-link>,
                        leia os
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
import { onMounted, ref } from 'vue';
import PortfolioService from '../services/PortfolioService';

const domains = [
    {
        title: 'Infraestrutura & Redes',
        description: 'Desenho, operação e manutenção de ambientes físicos e cloud, com foco em conectividade, disponibilidade, resiliência e continuidade de serviço.',
    },
    {
        title: 'Segurança, IAM & Auditoria',
        description: 'Gestão de identidades e acessos, controlo de permissões e rastreabilidade operacional para reforço de segurança e integridade dos sistemas.',
    },
    {
        title: 'Automação & Operação',
        description: 'Automação de tarefas operacionais, padronização de procedimentos e suporte à estabilidade e eficiência dos serviços.',
    },
    {
        title: 'Sistemas & Confiabilidade',
        description: 'Suporte à fiabilidade de sistemas, integração entre camadas tecnológicas e otimização contínua da operação.',
    },
];

const technologies = [
    { label: 'Sistemas e Infraestrutura', items: ['Linux', 'Windows Server', 'Active Directory', 'TCP/IP', 'VLANs', 'SSH', 'troubleshooting de redes e sistemas'] },
    { label: 'Virtualização & Cloud', items: ['Docker', 'VMware', 'Hyper-V'] },
    { label: 'Automação e Operação', items: ['PowerShell', 'Bash', 'Power Automate'] },
    { label: 'Dados e Integração', items: ['PostgreSQL', 'Microsoft 365', 'APIs'] },
];

const profileImage = '/bungaantonio-brand.jpeg';

const featuredProjects = ref([]);

function displayTitle(project) {
    return project.shortTitle || project.title;
}

onMounted(async () => {
    try {
        const items = await PortfolioService.loadItems();
        featuredProjects.value = items.filter((item) => item.featured).slice(0, 2);
    } catch (error) {
        console.error('Erro ao carregar projetos em destaque:', error);
    }
});
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

.section-label {
    @apply text-sm font-bold uppercase tracking-wide text-secondary-600 dark:text-secondary-300;
}

.system-grid__card {
    @apply rounded-xl border border-secondary-200 bg-secondary-50/50 px-4 py-4 transition-all duration-300 ease-in-out hover:border-primary-400 hover:bg-white hover:shadow-md dark:border-secondary-700 dark:bg-secondary-800/50 dark:hover:border-primary-500 dark:hover:bg-secondary-800;
}

.system-grid__card-title {
    @apply text-[13px] font-bold leading-tight text-secondary-700 dark:text-secondary-200;
}

.system-grid__card-desc {
    @apply mt-2 text-xs leading-relaxed text-secondary-600 dark:text-secondary-400;
}

.tech-grid {
    @apply grid grid-cols-1 sm:grid-cols-2 gap-3;
}

.tech-grid__group {
    @apply rounded-xl border border-secondary-200 bg-card-bg px-4 py-3 dark:border-secondary-700 dark:bg-card-bg-dark;
}

.tech-grid__label {
    @apply text-xs font-bold uppercase tracking-wide text-secondary-500 dark:text-secondary-400;
}

.tech-grid__items {
    @apply mt-1 text-sm text-secondary-700 dark:text-secondary-200;
}

.featured-card {
    @apply rounded-2xl border border-secondary-200 bg-card-bg p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md dark:border-secondary-700 dark:bg-card-bg-dark dark:hover:border-primary-500;
}

.featured-card__title {
    @apply text-base font-semibold leading-snug text-secondary dark:text-secondary-100;
}

.featured-badge {
    @apply inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide;
}

.featured-badge--academia {
    @apply bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-200;
}

.featured-badge--corporativo {
    @apply bg-secondary-200 text-secondary-800 dark:bg-secondary-700 dark:text-secondary-100;
}

.stack-chip {
    @apply inline-block rounded-md border border-secondary-200 bg-secondary-50 px-2 py-0.5 text-[11px] font-medium text-secondary-700 dark:border-secondary-600 dark:bg-secondary-800 dark:text-secondary-200;
}

.stack-chip--more {
    @apply border-dashed;
}

.link {
    @apply border-b border-transparent transition-all duration-300;
}

.link:hover {
    color: theme('colors.primary.DEFAULT');
    @apply border-primary-500;
}
</style>

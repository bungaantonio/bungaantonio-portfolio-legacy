<template>
    <nav v-if="previousPost || nextPost" class="post-nav" aria-label="Navegação entre entradas">
      <router-link 
        v-if="previousPost" 
        :to="`${basePath}/${previousPost.id}`" 
        class="post-nav__card"
        :aria-label="`${previousLabel}: ${previousPost.title}`"
      >
        <span class="post-nav__eyebrow">&larr; {{ previousLabel }}</span>
        <span class="post-nav__title">{{ previousPost.title }}</span>
      </router-link>
  
      <router-link 
        v-if="nextPost" 
        :to="`${basePath}/${nextPost.id}`" 
        class="post-nav__card post-nav__card--align-right"
        :aria-label="`${nextLabel}: ${nextPost.title}`"
      >
        <span class="post-nav__eyebrow">{{ nextLabel }} &rarr;</span>
        <span class="post-nav__title">{{ nextPost.title }}</span>
      </router-link>
    </nav>
  </template>
  
  <script>
  export default {
    props: {
      previousPost: Object,
      nextPost: Object,
      basePath: {
        type: String,
        default: '/blog',
      },
      previousLabel: {
        type: String,
        default: 'Mais recente',
      },
      nextLabel: {
        type: String,
        default: 'Mais antigo',
      },
    },
  };
  </script>
  
  <style scoped>
  .post-nav {
    @apply mt-12 grid gap-4 border-t border-secondary-200 pt-8 dark:border-secondary-700 md:grid-cols-2;
  }

  .post-nav__card {
    @apply flex min-h-28 flex-col justify-between gap-2 rounded-2xl border border-secondary-200 bg-secondary-50 p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-md dark:border-secondary-700 dark:bg-secondary-800 dark:hover:border-primary-400;
  }

  .post-nav__card--align-right {
    @apply md:text-right;
  }

  .post-nav__eyebrow {
    @apply text-xs font-semibold uppercase tracking-[0.18em] text-secondary-500 dark:text-secondary-300;
  }

  .post-nav__title {
    @apply text-base font-semibold leading-relaxed text-secondary dark:text-secondary-100;
  }
  </style>
  

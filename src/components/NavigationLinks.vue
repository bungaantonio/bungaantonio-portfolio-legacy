<template>
    <nav v-if="newerEntry || olderEntry" class="post-nav" aria-label="Navegação entre entradas">
      <div class="post-nav__slot">
        <router-link
          v-if="newerEntry"
          :to="`${basePath}/${newerEntry.id}`"
          class="post-nav__card"
          :aria-label="`${newerLabel}: ${newerEntry.title}`"
        >
          <span class="post-nav__eyebrow">&larr; {{ newerLabel }}</span>
          <span class="post-nav__title">{{ newerEntry.title }}</span>
        </router-link>
      </div>

      <div class="post-nav__slot post-nav__slot--right">
        <router-link
          v-if="olderEntry"
          :to="`${basePath}/${olderEntry.id}`"
          class="post-nav__card post-nav__card--align-right"
          :aria-label="`${olderLabel}: ${olderEntry.title}`"
        >
          <span class="post-nav__eyebrow">{{ olderLabel }} &rarr;</span>
          <span class="post-nav__title">{{ olderEntry.title }}</span>
        </router-link>
      </div>
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
    computed: {
      newerEntry() {
        return this.previousPost;
      },
      olderEntry() {
        return this.nextPost;
      },
      newerLabel() {
        return this.previousLabel;
      },
      olderLabel() {
        return this.nextLabel;
      },
    },
  };
  </script>
  
  <style scoped>
  .post-nav {
    @apply mt-12 grid gap-4 border-t border-secondary-200 pt-8 dark:border-secondary-700 md:grid-cols-2;
  }

  .post-nav__slot {
    @apply min-h-28;
  }

  .post-nav__slot--right {
    @apply md:flex md:justify-end;
  }

  .post-nav__card {
    @apply flex h-full min-h-28 w-full flex-col justify-between gap-2 rounded-2xl border border-secondary-200 bg-secondary-50 p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-md dark:border-secondary-700 dark:bg-secondary-800 dark:hover:border-primary-400 md:max-w-none;
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
  
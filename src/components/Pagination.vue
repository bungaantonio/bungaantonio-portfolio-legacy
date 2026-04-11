<template>
    <nav
      v-if="totalPages > 1"
      class="mt-10"
      role="navigation"
      aria-label="Paginação do blog"
    >
      <div class="pagination-shell">
        <button
          @click="changePage(currentPage - 1)"
          class="pagination-nav"
          :disabled="currentPage === 1"
          aria-label="Página anterior"
        >
          &larr; Anterior
        </button>

        <div class="pagination-pages">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="['pagination-page', { 'pagination-page--active': page === currentPage }]"
            :aria-current="page === currentPage ? 'page' : null"
            :aria-label="`Ir para a página ${page}`"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="changePage(currentPage + 1)"
          class="pagination-nav"
          :disabled="currentPage === totalPages"
          aria-label="Próxima página"
        >
          Próxima &rarr;
        </button>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    props: {
      currentPage: Number,
      totalPages: Number,
    },
    computed: {
      visiblePages() {
        return Array.from({ length: this.totalPages }, (_, index) => index + 1);
      },
    },
    methods: {
      changePage(page) {
        if (page < 1 || page > this.totalPages || page === this.currentPage) {
          return;
        }

        this.$emit('changePage', page);
      },
    },
  };
  </script>
  
  <style scoped>
  .pagination-shell {
    @apply flex flex-col items-center justify-center gap-4 rounded-2xl border border-secondary-200 bg-card-bg p-4 shadow-sm dark:border-secondary-700 dark:bg-card-bg-dark md:flex-row md:gap-6;
  }

  .pagination-pages {
    @apply flex flex-wrap items-center justify-center gap-2;
  }

  .pagination-page {
    @apply min-w-11 rounded-xl border border-secondary-200 bg-secondary-50 px-4 py-2 text-sm font-semibold text-secondary transition-all duration-200 hover:border-primary hover:text-primary dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-100 dark:hover:border-primary-400 dark:hover:text-primary-300;
  }

  .pagination-page--active {
    @apply border-primary bg-primary text-white shadow-sm pointer-events-none dark:border-primary-400 dark:bg-primary-400 dark:text-secondary-900;
  }

  .pagination-nav {
    @apply rounded-xl border border-secondary-200 px-4 py-2 text-sm font-semibold text-secondary transition-all duration-200 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-secondary-200 disabled:hover:text-secondary dark:border-secondary-700 dark:text-secondary-100 dark:hover:border-primary-400 dark:hover:text-primary-300 dark:disabled:hover:border-secondary-700 dark:disabled:hover:text-secondary-100;
  }
  </style>
  

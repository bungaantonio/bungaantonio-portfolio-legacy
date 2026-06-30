<template>
  <div class="container mx-auto px-4 component-spacing">
    <h1 class="text-title mb-3">Portfólio</h1>
    <p class="text-body mb-8 max-w-2xl">
      Projectos documentados até ao momento. Novos casos de estudo são adicionados conforme evoluo.
    </p>

    <div v-if="hasError" class="text-center p-4">
      <p>{{ errorMessage }}</p>
    </div>

    <div v-else-if="!itemsLoaded" class="text-center p-4 flex justify-center items-center">
      <p>A carregar projetos...</p>
      <div class="loader"></div>
    </div>

    <div v-else>
      <div class="portfolio-tools">
        <label class="search-box" for="portfolio-search">
          <span class="search-box__label">Pesquisar projetos</span>
          <input
            id="portfolio-search"
            v-model.trim="searchQuery"
            type="search"
            class="search-box__input"
            placeholder="Pesquisar por título, stack ou tema..."
            aria-label="Pesquisar projetos"
          />
        </label>
        <p class="search-box__meta">
          {{ filteredItems.length }} resultado{{ filteredItems.length === 1 ? '' : 's' }}
        </p>
      </div>

      <div v-if="displayedItems.length > 0" class="space-y-4 md:space-y-6">
        <div
          v-for="item in displayedItems"
          :key="item.id"
          class="card"
        >
          <article>
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-3 gap-2">
              <router-link
                :to="`/portfolio/${item.id}`"
                class="link text-lg md:text-xl font-medium"
                v-html="highlightText(displayTitle(item))"
              />
              <div class="flex items-center gap-3">
                <span v-if="item.formattedDate" class="text-muted text-sm">{{ item.formattedDate }}</span>
                <span
                  v-if="item.category"
                  class="portfolio-badge"
                  :class="categoryClass(item.category)"
                >
                  {{ categoryLabel(item.category) }}
                </span>
              </div>
            </div>

            <div v-if="item.stack.length" class="mb-3 flex flex-wrap gap-2">
              <span
                v-for="tech in item.stack"
                :key="tech"
                class="stack-chip"
              >
                {{ tech }}
              </span>
            </div>

            <p class="text-body" v-html="highlightExcerpt(item)" />

            <p class="mt-3">
              <router-link
                :to="`/portfolio/${item.id}`"
                class="link font-semibold"
              >
                Ver caso de estudo
              </router-link>
            </p>
          </article>
        </div>
      </div>

      <div v-else>
        <p>{{ searchQuery ? 'Nenhum projeto encontrado para esta pesquisa.' : 'Ainda não há projetos para mostrar.' }}</p>
      </div>

      <Pagination
        v-if="totalPages > 1"
        :currentPage="currentPage"
        :totalPages="totalPages"
        @changePage="changePage"
      />
    </div>
  </div>
</template>

<script>
import PortfolioService from '../services/PortfolioService';
import Pagination from './Pagination.vue';

export default {
  components: {
    Pagination,
  },
  data() {
    return {
      items: [],
      itemsLoaded: false,
      currentPage: 1,
      itemsPerPage: 5,
      searchQuery: '',
      hasError: false,
      errorMessage: 'Ocorreu um erro ao carregar os projetos. Por favor, tente novamente mais tarde.',
    };
  },
  computed: {
    filteredItems() {
      const query = this.normalizeText(this.searchQuery);

      if (!query) {
        return this.items;
      }

      return this.items.filter((item) => {
        const haystack = this.normalizeText([
          item.title,
          item.shortTitle,
          item.description,
          item.excerpt,
          item.body,
          item.category,
          ...(item.tags || []),
          ...(item.stack || []),
        ].join(' '));

        return haystack.includes(query);
      });
    },
    displayedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredItems.slice(start, end);
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredItems.length / this.itemsPerPage));
    },
  },
  watch: {
    searchQuery() {
      this.currentPage = 1;
    },
  },
  async mounted() {
    await this.loadItems();
  },
  methods: {
    async loadItems() {
      try {
        this.items = await PortfolioService.loadItems();
        this.hasError = false;
      } catch (error) {
        console.error('Erro ao carregar projetos:', error);
        this.items = [];
        this.hasError = true;
      } finally {
        this.itemsLoaded = true;
      }
    },
    categoryLabel(category) {
      const labels = {
        academia: 'Academia',
        corporativo: 'Corporativo',
      };
      return labels[category] || category;
    },
    categoryClass(category) {
      return category === 'academia'
        ? 'portfolio-badge--academia'
        : 'portfolio-badge--corporativo';
    },
    displayTitle(item) {
      return item.shortTitle || item.title;
    },
    normalizeText(value = '') {
      return value
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
    },
    escapeHtml(value = '') {
      return value
        .toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    },
    escapeRegExp(value = '') {
      return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },
    highlightText(value = '') {
      const safeText = this.escapeHtml(value);
      const query = this.searchQuery.trim();

      if (!query) {
        return safeText;
      }

      const pattern = new RegExp(`(${this.escapeRegExp(query)})`, 'gi');
      return safeText.replace(pattern, '<mark class="search-highlight">$1</mark>');
    },
    highlightExcerpt(item) {
      const content = item.excerpt || item.description || '';
      return this.highlightText(content);
    },
    changePage(page) {
      this.currentPage = page;
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
  },
};
</script>

<style scoped>
.portfolio-tools {
  @apply mb-8 flex flex-col gap-3 rounded-2xl border border-secondary-200 bg-card-bg p-4 shadow-sm dark:border-secondary-700 dark:bg-card-bg-dark;
}

.search-box {
  @apply flex flex-col gap-2;
}

.search-box__label {
  @apply text-sm font-semibold text-secondary dark:text-secondary-100;
}

.search-box__input {
  @apply w-full rounded-xl border border-secondary-200 bg-white px-4 py-3 text-secondary outline-none transition-all duration-200 placeholder:text-secondary-400 focus:border-primary focus:ring-2 focus:ring-primary-200 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-100 dark:placeholder:text-secondary-400 dark:focus:border-primary-400 dark:focus:ring-primary-900;
}

.search-box__meta {
  @apply text-sm text-secondary-500 dark:text-secondary-300;
}

.portfolio-badge {
  @apply inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide;
}

.portfolio-badge--academia {
  @apply bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-200;
}

.portfolio-badge--corporativo {
  @apply bg-secondary-200 text-secondary-800 dark:bg-secondary-700 dark:text-secondary-100;
}

.stack-chip {
  @apply inline-block rounded-md border border-secondary-200 bg-secondary-50 px-2.5 py-1 text-xs font-medium text-secondary-700 dark:border-secondary-600 dark:bg-secondary-800 dark:text-secondary-200;
}

:deep(.search-highlight) {
  @apply rounded bg-yellow-200 px-1 text-secondary dark:bg-yellow-300 dark:text-secondary-900;
}

.loader {
  border: 4px solid theme('colors.secondary.200');
  border-top: 4px solid theme('colors.primary.DEFAULT');
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 2s linear infinite;
  margin-left: 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

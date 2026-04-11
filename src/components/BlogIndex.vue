<template>
  <div class="container mx-auto px-4 component-spacing">
    <h1 class="text-title mb-6">Blog</h1>

    <!-- Se houver erro ao carregar os posts -->
    <div v-if="hasError" class="text-center p-4">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- Se os posts ainda não foram carregados -->
    <div v-else-if="!postsLoaded" class="text-center p-4 flex justify-center items-center">
      <p>A carregar os posts...</p>
      <div class="loader"></div>
    </div>

    <!-- Se houver posts carregados -->
    <div v-else>
      <div class="blog-tools">
        <label class="search-box" for="blog-search">
          <span class="search-box__label">Pesquisar posts</span>
          <input
            id="blog-search"
            v-model.trim="searchQuery"
            type="search"
            class="search-box__input"
            placeholder="Pesquisar por título, tag ou tema..."
            aria-label="Pesquisar posts"
          />
        </label>
        <p class="search-box__meta">
          {{ filteredPosts.length }} resultado{{ filteredPosts.length === 1 ? '' : 's' }}
        </p>
      </div>

      <div v-if="displayedPosts.length > 0" class="space-y-4 md:space-y-6">
        <div
          v-for="post in displayedPosts"
          :key="post.id"
          class="card"
        >
          <article>
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-2">
              <router-link
                :to="`/blog/${post.id}`"
                class="link text-lg md:text-xl font-medium mb-1 md:mb-0"
                v-html="highlightText(post.title)"
              >
              </router-link>
              <span class="text-muted text-sm">Publicado em: {{ post.formattedDate }}</span>
            </div>
            <p class="text-body" v-html="highlightExcerpt(post)">
            </p>
            <p class="mt-2">
              <router-link
                :to="`/blog/${post.id}`"
                class="link font-semibold"
              >
                Ler mais
              </router-link>
            </p>
          </article>
        </div>
      </div>

      <!-- Se não houver posts -->
      <div v-else>
        <p>{{ searchQuery ? 'Nenhum post encontrado para esta pesquisa.' : 'Ainda não há posts para mostrar.' }}</p>
      </div>

      <!-- Paginação -->
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
import PostService from '../services/PostService';
import Pagination from './Pagination.vue'; // Importar o componente de paginação

export default {
  components: {
    Pagination,
  },
  data() {
    return {
      posts: [],
      postsLoaded: false,
      currentPage: 1,
      postsPerPage: 5,
      searchQuery: '',
      hasError: false,
      errorMessage: 'Ocorreu um erro ao carregar os posts. Por favor, tente novamente mais tarde.',
    };
  },
  computed: {
    filteredPosts() {
      const query = this.normalizeText(this.searchQuery);

      if (!query) {
        return this.posts;
      }

      return this.posts.filter((post) => {
        const haystack = this.normalizeText([
          post.title,
          post.description,
          post.excerpt,
          post.body,
          ...(post.tags || []),
        ].join(' '));

        return haystack.includes(query);
      });
    },
    displayedPosts() {
      const start = (this.currentPage - 1) * this.postsPerPage;
      const end = start + this.postsPerPage;
      return this.filteredPosts.slice(start, end);
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredPosts.length / this.postsPerPage));
    },
  },
  watch: {
    searchQuery() {
      this.currentPage = 1;
    },
  },
  async mounted() {
    await this.loadPosts();
  },
  methods: {
    async loadPosts() {
      try {
        const rawPosts = await PostService.loadPosts();
        this.posts = rawPosts;
        this.hasError = false;
      } catch (error) {
        console.error('Erro ao carregar posts:', error);
        this.posts = [];
        this.hasError = true;
      } finally {
        this.postsLoaded = true;
      }
    },
    formatDate(dateString) {
      return PostService.formatDate(dateString);
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
    highlightExcerpt(post) {
      const content = post.excerpt || post.description || '';
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
.blog-tools {
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

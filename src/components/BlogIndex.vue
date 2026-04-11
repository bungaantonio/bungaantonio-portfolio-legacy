<template>
  <div class="container mx-auto px-4">
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
              >
                {{ post.title }}
              </router-link>
              <span class="text-muted text-sm">Publicado em: {{ post.formattedDate }}</span>
            </div>
            <p class="text-body">
              {{ post.excerpt }}
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
        <p>Ainda não há posts para mostrar.</p>
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
      hasError: false,
      errorMessage: 'Ocorreu um erro ao carregar os posts. Por favor, tente novamente mais tarde.',
    };
  },
  computed: {
    displayedPosts() {
      const start = (this.currentPage - 1) * this.postsPerPage;
      const end = start + this.postsPerPage;
      return this.posts.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.posts.length / this.postsPerPage);
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
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
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

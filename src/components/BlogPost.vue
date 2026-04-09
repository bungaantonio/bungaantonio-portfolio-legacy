<template>
    <div v-if="postLoaded">
      <div v-if="hasError" class="bg-white p-8 rounded-lg shadow-md">
        <p class="mb-4">{{ errorMessage }}</p>
        <router-link to="/blog" class="text-blue-600 hover:underline">Voltar para o Blog</router-link>
      </div>

      <!-- Post encontrado -->
      <div v-else-if="postContent && post" class="bg-white p-8 rounded-lg shadow-md">
        <div class="flex items-center justify-between mb-6">
          <router-link to="/blog" class="text-blue-600 hover:underline">
            &larr; Voltar para o Blog
          </router-link>
          <span class="text-gray-500 text-sm">Publicado em: {{ formatDate(post.date) }}</span>
        </div>
  
        <h1 class="text-3xl font-bold mb-4">{{ post.title }}</h1>
        <p class="text-gray-600 mb-4">{{ post.description }}</p>
  
        <div v-if="post.tags.length" class="mb-6">
          <span v-for="tag in post.tags" :key="tag"
            class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            {{ tag }}
          </span>
        </div>
  
        <div v-html="postContent" class="prose max-w-none mb-8"></div>
  
        <!-- Navegação Próximo/Anterior -->
        <NavigationLinks :previousPost="previousPost" :nextPost="nextPost" />
      </div>
  
      <!-- Post não encontrado -->
      <div v-else>
        <p>Post não encontrado. 
          <router-link to="/blog" class="text-blue-600 hover:underline">Voltar para o Blog</router-link>
        </p>
      </div>
    </div>
  
    <!-- Carregando -->
    <div v-else>
      <p>Carregando Post...</p>
    </div>
  </template>
  
  <script>
  import PostService from '../services/PostService';
  import { marked } from 'marked';
  import { sanitizeHtml } from '../services/sanitizeHtml';
  import NavigationLinks from './NavigationLinks.vue'; // Componente extraído para navegação
  
  export default {
    components: {
      NavigationLinks,
    },
    data() {
      return {
        post: null,
        allPosts: [],
        nextPost: null,
        previousPost: null,
        postContent: null,
        postLoaded: false,
        hasError: false,
        errorMessage: 'Não foi possível carregar este post.',
      };
    },
    watch: {
      '$route.params.postId': {
        async handler() {
          this.postLoaded = false;
          await this.fetchPostsAndContent();
          this.postLoaded = true;
        },
        immediate: true,
      },
    },
    methods: {
      async fetchPostsAndContent() {
        try {
          this.hasError = false;
          const allPosts = await PostService.loadPosts();
          this.allPosts = allPosts;
  
          const postId = this.$route.params.postId;
          const post = await PostService.getPost(postId);
  
          if (post) {
            this.postContent = sanitizeHtml(marked.parse(post.body));
            this.post = post;
            this.setNavigationPosts(postId);
            this.updatePageMetadata(post);
          } else {
            this.clearPostData();
            this.updatePageMetadata();
          }
        } catch (error) {
          console.error("Erro ao carregar post:", error);
          this.hasError = true;
          this.clearPostData();
          this.updatePageMetadata();
        }
      },
      clearPostData() {
        this.post = null;
        this.postContent = null;
        this.nextPost = null;
        this.previousPost = null;
      },
      setNavigationPosts(postId) {
        const currentIndex = this.allPosts.findIndex(p => p.id === postId);
  
        if (currentIndex !== -1) {
          this.nextPost = this.allPosts[currentIndex + 1] || null;
          this.previousPost = this.allPosts[currentIndex - 1] || null;
        } else {
          console.warn(`Post with ID ${postId} not found in allPosts.`);
          this.nextPost = null;
          this.previousPost = null;
        }
      },
      updatePageMetadata(post = null) {
        if (typeof document === 'undefined') {
          return;
        }

        const defaultTitle = 'Bunga António @ Software Engineer | Back-End Engineer';
        const defaultDescription = 'Bem-vindo ao portfólio de Bunga António, engenheiro de software e entusiasta de tecnologia, onde compartilho meus artigos e experiências.';
        const metaDescription = document.querySelector('meta[name="description"]');

        document.title = post ? `${post.title} | Bunga António` : defaultTitle;

        if (metaDescription) {
          metaDescription.setAttribute('content', post?.description || defaultDescription);
        }
      },
      formatDate(dateString) {
        return PostService.formatDate(dateString);
      },
    },
  };
  </script>
  
  <style scoped>
  /* Carregando, mensagens de erro e navegação extraída */
  </style>
  

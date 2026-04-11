<template>
    <div v-if="postLoaded">
      <div v-if="hasError" class="card">
        <p class="mb-4">{{ errorMessage }}</p>
        <router-link to="/blog" class="link">Voltar para o Blog</router-link>
      </div>

      <!-- Post encontrado -->
      <div v-else-if="postContent && post">
        <ReadingProgress />
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <router-link to="/blog" class="link">
              &larr; Voltar para o Blog
            </router-link>
            <span class="text-muted text-sm">Publicado em: {{ formatDate(post.date) }}</span>
          </div>
  
          <h1 class="text-title mb-4">{{ post.title }}</h1>
          <p class="text-secondary dark:text-secondary-200 mb-4">{{ post.description }}</p>
  
          <div v-if="post.tags.length" class="mb-6">
            <span v-for="tag in post.tags" :key="tag"
              class="inline-block bg-secondary-200 dark:bg-secondary-700 rounded-full px-3 py-1 text-sm font-semibold text-secondary dark:text-secondary-200 mr-2 mb-2">
              {{ tag }}
            </span>
          </div>
  
          <div
            ref="postContent"
            v-html="postContent"
            class="prose prose-slate dark:prose-invert max-w-none mb-8"
            @click="handleContentClick"
          ></div>
  
          <!-- Navegação Próximo/Anterior -->
          <NavigationLinks :previousPost="previousPost" :nextPost="nextPost" />
        </div>

        <div
          v-if="lightboxImage"
          class="lightbox"
          role="dialog"
          aria-modal="true"
          :aria-label="lightboxAlt || 'Imagem ampliada'"
          @click.self="closeLightbox"
        >
          <button type="button" class="lightbox__close" @click="closeLightbox" aria-label="Fechar imagem">
            Fechar
          </button>
          <figure class="lightbox__figure">
            <img :src="lightboxImage" :alt="lightboxAlt" class="lightbox__image" />
            <figcaption v-if="lightboxAlt" class="lightbox__caption">{{ lightboxAlt }}</figcaption>
          </figure>
        </div>
      </div>
  
      <!-- Post não encontrado -->
      <div v-else>
        <p>Post não encontrado. 
          <router-link to="/blog" class="link">Voltar para o Blog</router-link>
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
import ReadingProgress from './ReadingProgress.vue';
  
  export default {
    components: {
      NavigationLinks,
      ReadingProgress,
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
        lightboxImage: null,
        lightboxAlt: '',
      };
    },
    mounted() {
      if (typeof window !== 'undefined') {
        window.addEventListener('keydown', this.handleKeydown);
      }
    },
    beforeUnmount() {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', this.handleKeydown);
      }
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
            const bodyWithCallouts = post.body.replace(/^>\s*\[(info|dica|aviso)\]\s*(.*)$/gim, (_, type, content) => {
              const normalized = type.toLowerCase() === 'dica' ? 'info' : type.toLowerCase();
              return `<blockquote class="callout callout-${normalized}">${content}</blockquote>`;
            });
            const parsedHtml = marked.parse(bodyWithCallouts);
            this.postContent = this.rewriteAssetUrls(sanitizeHtml(parsedHtml), post);
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
        this.closeLightbox();
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

        const defaultTitle = 'Bunga António @ Software & System Engineer';
        const defaultDescription = 'Bem-vindo ao portfólio de Bunga António, engenheiro de software e entusiasta de tecnologia, onde compartilho meus artigos e experiências.';
        const metaDescription = document.querySelector('meta[name="description"]');

        document.title = post ? `${post.title} | Bunga António` : defaultTitle;

        if (metaDescription) {
          metaDescription.setAttribute('content', post?.description || defaultDescription);
        }
      },
      rewriteAssetUrls(html, post) {
        if (typeof document === 'undefined') {
          return html;
        }

        const container = document.createElement('div');
        container.innerHTML = html;

        container.querySelectorAll('img').forEach((image) => {
          const src = image.getAttribute('src');
          if (!src) return;
          image.setAttribute('src', PostService.resolveAssetPath(post, src));
          image.setAttribute('loading', 'lazy');
          image.setAttribute('decoding', 'async');
        });

        container.querySelectorAll('a').forEach((link) => {
          const href = link.getAttribute('href');
          if (!href) return;
          link.setAttribute('href', PostService.resolveAssetPath(post, href));
        });

        return container.innerHTML;
      },
      handleContentClick(event) {
        const image = event.target.closest('img');
        if (!image) {
          return;
        }

        const link = image.closest('a');
        const fullImage = link?.getAttribute('href') || image.getAttribute('src');

        if (!fullImage) {
          return;
        }

        event.preventDefault();
        this.lightboxImage = fullImage;
        this.lightboxAlt = image.getAttribute('alt') || '';
      },
      closeLightbox() {
        this.lightboxImage = null;
        this.lightboxAlt = '';
      },
      handleKeydown(event) {
        if (event.key === 'Escape' && this.lightboxImage) {
          this.closeLightbox();
        }
      },
      formatDate(dateString) {
        return PostService.formatDate(dateString);
      },
    },
  };
  </script>
  
  <style scoped>
  .lightbox {
    @apply fixed inset-0 z-[70] flex items-center justify-center bg-secondary-900/85 p-4 backdrop-blur-sm;
  }

  .lightbox__close {
    @apply absolute right-4 top-4 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-secondary shadow-sm transition hover:bg-primary hover:text-white dark:bg-secondary-100 dark:text-secondary-900;
  }

  .lightbox__figure {
    @apply m-0 flex max-h-full max-w-6xl flex-col items-center gap-3;
  }

  .lightbox__image {
    @apply max-h-[85vh] w-auto max-w-full rounded-2xl border border-white/20 shadow-2xl;
  }

  .lightbox__caption {
    @apply text-center text-sm text-white/85;
  }
  </style>
  

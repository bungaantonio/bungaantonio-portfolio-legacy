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
  
          <div ref="postContent" v-html="postContent" class="prose prose-slate dark:prose-invert max-w-none mb-8"></div>
  
          <!-- Navegação Próximo/Anterior -->
          <NavigationLinks :previousPost="previousPost" :nextPost="nextPost" />
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
      postContent() {
        this.$nextTick(() => {
          this.addCopyButtons();
        });
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
            this.postContent = sanitizeHtml(marked.parse(bodyWithCallouts));
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

        const defaultTitle = 'Bunga António @ Software & Systems Engineer';
        const defaultDescription = 'Bem-vindo ao portfólio de Bunga António, engenheiro de software e entusiasta de tecnologia, onde compartilho meus artigos e experiências.';
        const metaDescription = document.querySelector('meta[name="description"]');

        document.title = post ? `${post.title} | Bunga António` : defaultTitle;

        if (metaDescription) {
          metaDescription.setAttribute('content', post?.description || defaultDescription);
        }
      },
      addCopyButtons() {
        const postContainer = this.$refs.postContent;
        if (!postContainer) return;

        const codeBlocks = postContainer.querySelectorAll('pre');
        codeBlocks.forEach((pre) => {
          if (pre.dataset.copyButtonAttached) return;
          pre.dataset.copyButtonAttached = 'true';

          const codeElement = pre.querySelector('code');
          const wrapper = document.createElement('div');
          wrapper.className = 'code-copy-wrapper';
          const toolbar = document.createElement('div');
          toolbar.className = 'code-copy-toolbar';

          const languageLabel = document.createElement('span');
          languageLabel.className = 'code-copy-language';
          languageLabel.textContent = this.getCodeLanguage(codeElement);

          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'code-copy-btn';
          button.textContent = 'Copiar';
          button.setAttribute('aria-label', 'Copiar código');

          button.addEventListener('click', async () => {
            if (!codeElement) return;
            try {
              await this.copyCodeToClipboard(codeElement.innerText.trim());
              button.textContent = 'Copiado!';
              setTimeout(() => {
                button.textContent = 'Copiar';
              }, 1500);
            } catch (error) {
              console.error('Erro ao copiar código:', error);
              button.textContent = 'Erro';
              setTimeout(() => {
                button.textContent = 'Copiar';
              }, 1500);
            }
          });

          toolbar.appendChild(languageLabel);
          toolbar.appendChild(button);
          pre.parentNode?.insertBefore(wrapper, pre);
          wrapper.appendChild(toolbar);
          wrapper.appendChild(pre);
        });
      },
      getCodeLanguage(codeElement) {
        const className = codeElement?.className || '';
        const languageClass = className
          .split(' ')
          .find((entry) => entry.startsWith('language-'));

        if (!languageClass) {
          return 'Snippet';
        }

        return languageClass.replace('language-', '').toUpperCase();
      },
      async copyCodeToClipboard(text) {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          return;
        }

        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();

        const copied = document.execCommand('copy');
        document.body.removeChild(textarea);

        if (!copied) {
          throw new Error('Clipboard API indisponível');
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
  

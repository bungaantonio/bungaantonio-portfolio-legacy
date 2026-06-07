<template>
  <div v-if="itemLoaded">
    <div v-if="hasError" class="card">
      <p class="mb-4">{{ errorMessage }}</p>
      <router-link to="/portfolio" class="link">Voltar para o Portfólio</router-link>
    </div>

    <div v-else-if="itemContent && item">
      <ReadingProgress />
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <router-link to="/portfolio" class="link">
            &larr; Voltar para o Portfólio
          </router-link>
          <span
            v-if="item.category"
            class="portfolio-badge"
            :class="categoryClass(item.category)"
          >
            {{ categoryLabel(item.category) }}
          </span>
        </div>

        <h1 class="text-title mb-4">{{ item.title }}</h1>
        <p class="text-secondary dark:text-secondary-200 mb-4">{{ item.description }}</p>

        <div v-if="item.stack.length" class="mb-6 flex flex-wrap gap-2">
          <span
            v-for="tech in item.stack"
            :key="tech"
            class="stack-chip"
          >
            {{ tech }}
          </span>
        </div>

        <div v-if="item.tags.length" class="mb-6">
          <span
            v-for="tag in item.tags"
            :key="tag"
            class="inline-block bg-secondary-200 dark:bg-secondary-700 rounded-full px-3 py-1 text-sm font-semibold text-secondary dark:text-secondary-200 mr-2 mb-2"
          >
            {{ tag }}
          </span>
        </div>

        <div
          ref="itemContent"
          v-html="itemContent"
          class="prose prose-slate dark:prose-invert max-w-none mb-8"
          @click="handleContentClick"
        />

        <NavigationLinks
          :previousPost="previousItem"
          :nextPost="nextItem"
          basePath="/portfolio"
          previousLabel="Projeto mais recente"
          nextLabel="Projeto mais antigo"
        />
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

    <div v-else>
      <p>Projeto não encontrado.
        <router-link to="/portfolio" class="link">Voltar para o Portfólio</router-link>
      </p>
    </div>
  </div>

  <div v-else>
    <p>A carregar projeto...</p>
  </div>
</template>

<script>
import PortfolioService from '../services/PortfolioService';
import { marked } from 'marked';
import { sanitizeHtml } from '../services/sanitizeHtml';
import NavigationLinks from './NavigationLinks.vue';
import ReadingProgress from './ReadingProgress.vue';

export default {
  components: {
    NavigationLinks,
    ReadingProgress,
  },
  data() {
    return {
      item: null,
      allItems: [],
      nextItem: null,
      previousItem: null,
      itemContent: null,
      itemLoaded: false,
      hasError: false,
      errorMessage: 'Não foi possível carregar este projeto.',
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
    '$route.params.itemId': {
      async handler() {
        this.itemLoaded = false;
        await this.fetchItemAndContent();
        this.itemLoaded = true;
      },
      immediate: true,
    },
  },
  methods: {
    async fetchItemAndContent() {
      try {
        this.hasError = false;
        this.allItems = await PortfolioService.loadItems();

        const itemId = this.$route.params.itemId;
        const item = await PortfolioService.getItem(itemId);

        if (item) {
          const bodyWithCallouts = item.body.replace(/^>\s*\[(info|dica|aviso)\]\s*(.*)$/gim, (_, type, content) => {
            const normalized = type.toLowerCase() === 'dica' ? 'info' : type.toLowerCase();
            return `<blockquote class="callout callout-${normalized}">${content}</blockquote>`;
          });
          const parsedHtml = marked.parse(bodyWithCallouts);
          this.itemContent = this.rewriteAssetUrls(sanitizeHtml(parsedHtml), item);
          this.item = item;
          this.setNavigationItems(itemId);
          this.updatePageMetadata(item);
        } else {
          this.clearItemData();
          this.updatePageMetadata();
        }
      } catch (error) {
        console.error('Erro ao carregar projeto:', error);
        this.hasError = true;
        this.clearItemData();
        this.updatePageMetadata();
      }
    },
    clearItemData() {
      this.item = null;
      this.itemContent = null;
      this.nextItem = null;
      this.previousItem = null;
      this.closeLightbox();
    },
    setNavigationItems(itemId) {
      const currentIndex = this.allItems.findIndex((entry) => entry.id === itemId);

      if (currentIndex !== -1) {
        this.nextItem = this.allItems[currentIndex + 1] || null;
        this.previousItem = this.allItems[currentIndex - 1] || null;
      } else {
        this.nextItem = null;
        this.previousItem = null;
      }
    },
    updatePageMetadata(item = null) {
      if (typeof document === 'undefined') {
        return;
      }

      const defaultTitle = 'Bunga António @ Software & System Engineer';
      const defaultDescription = 'Bem-vindo ao portfólio de Bunga António, engenheiro de software e entusiasta de tecnologia, onde compartilho meus artigos e experiências.';
      const metaDescription = document.querySelector('meta[name="description"]');

      document.title = item ? `${item.title} | Bunga António` : defaultTitle;

      if (metaDescription) {
        metaDescription.setAttribute('content', item?.description || defaultDescription);
      }
    },
    rewriteAssetUrls(html, item) {
      if (typeof document === 'undefined') {
        return html;
      }

      const container = document.createElement('div');
      container.innerHTML = html;

      container.querySelectorAll('img').forEach((image) => {
        const src = image.getAttribute('src');
        if (!src) return;
        image.setAttribute('src', PortfolioService.resolveAssetPath(item, src));
        image.setAttribute('loading', 'lazy');
        image.setAttribute('decoding', 'async');
      });

      container.querySelectorAll('video').forEach((video) => {
        const src = video.getAttribute('src');
        const poster = video.getAttribute('poster');

        if (src) {
          video.setAttribute('src', PortfolioService.resolveAssetPath(item, src));
        }

        if (poster) {
          video.setAttribute('poster', PortfolioService.resolveAssetPath(item, poster));
        }

        if (!video.hasAttribute('controls')) {
          video.setAttribute('controls', '');
        }

        if (!video.hasAttribute('preload')) {
          video.setAttribute('preload', 'metadata');
        }

        video.classList.add('post-video');
      });

      container.querySelectorAll('video source').forEach((source) => {
        const src = source.getAttribute('src');
        if (!src) return;
        source.setAttribute('src', PortfolioService.resolveAssetPath(item, src));
      });

      container.querySelectorAll('a').forEach((link) => {
        const href = link.getAttribute('href');
        if (!href) return;
        link.setAttribute('href', PortfolioService.resolveAssetPath(item, href));
      });

      container.querySelectorAll('iframe').forEach((iframe) => {
        iframe.classList.add('post-embed-frame');

        if (!iframe.getAttribute('title')) {
          iframe.setAttribute('title', 'Embedded video');
        }

        if (!iframe.getAttribute('loading')) {
          iframe.setAttribute('loading', 'lazy');
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'post-embed';
        iframe.parentNode?.insertBefore(wrapper, iframe);
        wrapper.appendChild(iframe);
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
  },
};
</script>

<style scoped>
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

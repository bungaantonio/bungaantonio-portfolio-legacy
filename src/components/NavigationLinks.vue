<template>
    <div class="flex justify-between items-center mt-8 flex-wrap gap-4">
      <router-link 
        v-if="previousPost" 
        :to="`/blog/${previousPost.id}`" 
        class="link w-full md:w-auto overflow-hidden text-ellipsis whitespace-nowrap"
        :aria-label="`Leia o post mais recente: ${previousPost.title}`"
      >
        &larr; Mais recente - {{ previousPost.title }}
      </router-link>
  
      <!-- Post seguinte -->
      <router-link 
        v-if="nextPost" 
        :to="`/blog/${nextPost.id}`" 
        class="link w-full md:w-auto overflow-hidden text-ellipsis whitespace-nowrap"
        :aria-label="`Leia o post mais antigo: ${nextPost.title}`"
      >
        {{ nextPost.title }} - Mais antigo &rarr;
      </router-link>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      previousPost: Object,
      nextPost: Object,
    },
  };
  </script>
  
  <style scoped>
  /* Estilos específicos da navegação, se necessário */
  </style>
  
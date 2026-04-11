<template>
    <nav
      v-if="totalPages > 1"
      class="mt-8 flex justify-center space-x-2"
      role="navigation"
      aria-label="Paginação do blog"
    >
      <!-- Botão Anterior -->
      <button
        v-if="currentPage > 1"
        @click="changePage(currentPage - 1)"
        class="btn"
        aria-label="Página anterior"
      >
        Anterior
      </button>
  
      <button
        v-for="page in totalPages"
        :key="page"
        @click="changePage(page)"
        :class="[
          'btn',
          { 'bg-primary text-white hover:bg-primary-hover pointer-events-none': page === currentPage }
        ]"
        :aria-current="page === currentPage ? 'page' : null"
        :aria-disabled="page === currentPage"
        :aria-label="`Ir para a página ${page}`"
      >
        {{ page }}
      </button>
  
      <!-- Botão Próxima -->
      <button
        v-if="currentPage < totalPages"
        @click="changePage(currentPage + 1)"
        class="btn"
        aria-label="Próxima página"
      >
        Próximo
      </button>
    </nav>
  </template>
  
  <script>
  export default {
    props: {
      currentPage: Number,
      totalPages: Number,
    },
    methods: {
      changePage(page) {
        this.$emit('changePage', page);
      },
    },
  };
  </script>
  
  <style scoped>
  .btn {
    @apply px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-300 flex items-center justify-center;
  }
  </style>
  
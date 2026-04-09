<template>
    <main class="w-full">
        <div class="container mx-auto px-4 sm:px-6">
            <div class="max-w-4xl mx-auto">
                <section class="intro flex flex-col md:flex-row items-center mt-12">
                    <!-- Texto de introdução -->
                    <section class="md:w-3/5 md:pr-8">
                        <h1 class="text-3xl font-bold mb-4">Bem-vindo ao meu portfólio!</h1>
                        <p class="mb-4">
                            Sou um entusiasta da tecnologia e do impacto social, com experiência em engenharia
                            informática, gestão de produtos e desenvolvimento de software.
                        </p>
                    </section>
  
                    <!-- Foto -->
                    <section class="photo md:w-2/5">
                        <p class="image">
                            <img 
                                alt="Bunga António, engenheiro de software e entusiasta de tecnologia, posando na Faculdade de Engenharia UAN"
                                src="/bungaantonio-brand.jpeg"
                                class="rounded-lg shadow-md"
                                loading="lazy"
                                width="500"    
                                height="500"   
                            />
                        </p>
                        <p class="credit text-sm text-gray-600">Foto: Faculdade de Engenharia UAN</p>
                        <p class="mf-name text-xl font-bold mt-2">Bunga António</p>
                    </section>
                </section>
  
                <!-- Links para blog e contato -->
                <div class="mt-12 text-center">
                    <p class="text-gray-700 text-lg">
                        Veja meus
                        <router-link to="/blog" class="text-blue-600 hover:underline" aria-label="Ver últimos artigos">últimos artigos</router-link>
                        ou
                        <a 
                            href="https://www.linkedin.com/in/bungaantonio" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            class="text-blue-600 hover:underline"
                            aria-label="Entrar em contato no LinkedIn"
                        >
                            entre em contato
                        </a>.
                    </p>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
export default {
  // Não há necessidade de dados ou métodos adicionais aqui
};
</script>

<style scoped>
/* Transições suaves para links */
.text-blue-600:hover {
  transition: color 0.3s ease;
  color: #1e40af;
}

/* Para melhorar a responsividade da imagem */
.photo img {
  max-width: 100%;  /* Garante que a imagem nunca ultrapasse a largura da tela */
  height: auto;     /* Mantém a proporção da imagem */
  display: block;   /* Remove o espaço abaixo da imagem */
  margin: 0 auto;   /* Centraliza a imagem */
  transition: transform 0.3s ease-in-out;
}

.photo img:hover {
  transform: scale(1.05);  /* Efeito de zoom ao passar o mouse */
}
</style>

---
title: Modelo de Post de Teste
description: Post de referência para lembrar a estrutura dos artigos e testar blocos de código, callouts, tabelas e renderização em modo escuro.
tags: [modelo, teste, markdown, blog]
date: 2026-04-11
version: 1.0
author: Bunga António
---

> [info] Use este post como modelo base sempre que quiser publicar um novo artigo ou validar mudanças visuais no blog.

## Objetivo

Este artigo existe por dois motivos:

1. Servir como **modelo prático** para escrever novos posts.
2. Testar como o blog renderiza conteúdo em **light mode** e **dark mode**.

## Estrutura mínima recomendada

Quando fores criar um novo post, tenta lembrar desta sequência:

1. `title`: título claro e específico
2. `description`: resumo curto do valor do artigo
3. `tags`: palavras-chave úteis
4. `date`: data no formato `YYYY-MM-DD`
5. Corpo do texto com introdução, desenvolvimento e conclusão

## Exemplo de introdução

Começa com um parágrafo curto que explique o problema, o contexto e o que a pessoa vai aprender ao ler o artigo.

> [aviso] Evita descrições muito longas no `description`, porque ele também ajuda na listagem dos posts e no SEO.

## Exemplo de secção técnica

Se precisares mostrar comandos, usa blocos de código assim:

```bash
npm install
npm run dev
```

Ou então um exemplo em JavaScript:

```javascript
export function saudacao(nome) {
  return `Ola, ${nome}!`;
}

console.log(saudacao('Bunga'));
```

E um exemplo em Vue:

```vue
<template>
  <button class="btn" @click="copiar">Copiar</button>
</template>

<script>
export default {
  methods: {
    copiar() {
      console.log('Acao executada');
    },
  },
};
</script>
```

## Exemplo de lista

- Explica a ideia principal logo no início.
- Mantém os subtítulos curtos e claros.
- Usa exemplos concretos quando o tema for técnico.
- Fecha com uma conclusão ou próximo passo.

## Exemplo de tabela

| Elemento | Para que serve |
|----------|-----------------|
| `title` | Define o nome do artigo |
| `description` | Resume o conteúdo do post |
| `tags` | Ajuda a organizar os temas |
| `date` | Ordena cronologicamente os artigos |

## Exemplo de conclusão

Se este post estiver a aparecer corretamente, então já deves conseguir validar:

- renderização de markdown;
- estilos de tipografia;
- callouts;
- tabelas;
- blocos de código com botão de copiar;
- contraste no modo escuro.

## Modelo rápido para copiar

```md
---
title: Titulo do post
description: Resumo curto e claro do artigo.
tags: [tag-1, tag-2]
date: 2026-04-11
---

## Introducao

Explique aqui o problema e o objetivo do post.

## Desenvolvimento

Mostre os passos, exemplos, comandos ou raciocinio.

## Conclusao

Feche com o aprendizado principal ou proximo passo.
```

Se quiseres, no próximo passo eu também posso criar um segundo modelo mais “real”, no estilo dos teus melhores artigos, para servir de template editorial e não só técnico. 

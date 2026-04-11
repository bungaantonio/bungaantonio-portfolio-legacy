# Bunga António Portfolio

Portfólio pessoal e blog técnico construído com Vue 3, Vite e Tailwind CSS.

O projeto tem dois objetivos principais:

- apresentar o perfil profissional do Bunga António;
- publicar artigos técnicos em Markdown com navegação simples e leitura agradável.

## Stack

- Vue 3
- Vue Router
- Vite
- Tailwind CSS
- Marked + front-matter
- DOMPurify
- Vitest + Vue Test Utils

## O que existe hoje

- página inicial com apresentação pessoal;
- secção de blog com paginação;
- posts em Markdown com `front-matter`;
- navegação entre posts mais recentes e mais antigos;
- sanitização do HTML gerado a partir do Markdown;
- testes automatizados para serviço e componentes críticos.

## Estrutura do projeto

```text
src/
  blogs-posts/        Conteúdo dos artigos em Markdown
  components/         Componentes Vue
  router/             Configuração de rotas
  services/           Camada de parsing e utilitários
public/               Assets públicos
```

## Requisitos

- Node.js 20+ recomendado
- npm 10+

## Como executar

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

3. Gere a build de produção:

```bash
npm run build
```

4. Execute os testes:

```bash
npm test
```

## Como criar um novo post

Crie uma pasta para o post em `src/blogs-posts/<slug>/` e adicione um `index.md` com este formato:

```md
---
title: Título do artigo
description: Resumo curto do artigo
tags: [tag-1, tag-2]
date: 2026-04-09
---

Conteúdo em Markdown.
```

O nome da pasta passa a ser o `slug` do post.

Se o post tiver imagens, coloque tudo dentro da mesma pasta do artigo.

### Gerando previews de imagens

Para gerar versões mais leves das imagens de um post:

```bash
npm run images:preview -- "src/blogs-posts/11-04-2026-como-desenvolvi-o-qms"
```

Também pode personalizar largura, qualidade e sobrescrever previews antigas:

```bash
npm run images:preview -- "src/blogs-posts/11-04-2026-como-desenvolvi-o-qms" maxWidth=1600 quality=90 force
```

Uso recomendado no markdown:

```md
[![Legenda](./imagem-preview.jpg)](./imagem-original.png)
```

## Notas de manutenção

- Os posts são carregados localmente via `import.meta.glob`.
- O HTML resultante do Markdown é sanitizado antes de ser renderizado.
- O projeto usa `createWebHistory`, então o deploy precisa de fallback para `index.html` em rotas como `/blog/slug`.

## Qualidade e robustez

- Erros de carregamento do blog são tratados na interface.
- Datas inválidas recebem fallback visível.
- A navegação faz reset de scroll entre páginas.
- O projeto está padronizado em `npm` com `package-lock.json`.

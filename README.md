# Bunga António · Portfólio & Blog Técnico

[![Site](https://img.shields.io/badge/site-bungaantonio.tech-0ea5e9?style=for-the-badge)](https://www.bungaantonio.tech)
[![HTML Sanitized](https://img.shields.io/badge/renderização-DOMPurify%20sanitized-16a34a?style=for-the-badge&logo=shield&logoColor=white)](https://github.com/bungaantonio/bungaantonio-portfolio-legacy/blob/main/src/services/sanitizeHtml.js)
[![Tests](https://img.shields.io/badge/testes-Vitest-646cff?style=for-the-badge&logo=vitest&logoColor=white)](https://github.com/bungaantonio/bungaantonio-portfolio-legacy)
[![Vue 3](https://img.shields.io/badge/Vue-3-42b883?style=for-the-badge&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Deploy](https://img.shields.io/badge/deploy-Netlify-00c7b7?style=for-the-badge&logo=netlify&logoColor=white)](https://www.netlify.com/)

Portfólio pessoal e blog técnico construído com Vue 3, Vite e Tailwind CSS. O site regista a minha evolução como engenheiro informático: casos de estudo, reflexões técnicas e projectos em crescimento.

**Live:** [bungaantonio.tech](https://www.bungaantonio.tech) · **Portfólio:** [/portfolio](https://www.bungaantonio.tech/portfolio) · **Blog:** [/blog](https://www.bungaantonio.tech/blog)

---

## Perfil

Construo software orientado a sistemas e dados. Sou engenheiro informático a consolidar experiência em desenvolvimento de software. Até aqui, trabalhei sobretudo no backend, bases de dados e integração de sistemas, em projectos académicos e um MVP interno.

Tenho grande interesse no desenvolvimento de sistemas web, foco na integridade de dados e aplicação de boas práticas em PostgreSQL. Gosto de transformar necessidades concretas em código funcional e continuo a aprender com equipas e contextos reais.

### Áreas de interesse

| Área | Foco actual |
|------|-------------|
| **Identidade & Acesso** | Autenticação (JWT) e isolamento de dados |
| **Rastreabilidade** | Logs de auditoria e Hash Chaining |
| **Desenvolvimento de Software** | MVPs e iteração sobre regras de negócio |
| **Integração** | Hardware (biometria) com sistemas web |

### Tecnologias (uso frequente)

- **Backend:** Python (FastAPI), Node.js (NestJS), C#
- **Bases de Dados:** PostgreSQL, MySQL
- **Frontend:** React, HTMX, TailwindCSS
- **Ferramentas:** Docker, Git

---

## Selo de segurança do projecto

Este repositório aplica práticas de **renderização segura de conteúdo**:

| Medida | Implementação |
|--------|---------------|
| **Sanitização HTML** | Markdown convertido via `marked` e sanitizado com **DOMPurify** antes de `v-html` |
| **Conteúdo estático** | Posts e casos de estudo carregados em build time (`import.meta.glob`), sem input de utilizador persistido |
| **Rascunhos filtrados** | Entradas com `draft: true` ou `published: false` excluídas da listagem pública |
| **Testes automatizados** | Vitest cobre serviços de conteúdo e fluxos críticos da UI |
| **Deploy estático** | SPA servida via Netlify, sem superfície de ataque server-side |

> Conteúdo gerado por terceiros (markdown local) passa sempre por sanitização. Iframes e media são permitidos de forma explícita e controlada em `sanitizeHtml.js`.

---

## Resumo executivo

| | |
|---|---|
| **O quê** | Site pessoal com portfólio de casos de estudo e blog técnico |
| **Para quê** | Apresentar projectos reais (TFC + MVP corporativo) e escrita técnica a recrutadores e equipas de engenharia |
| **Como** | Vue 3 SPA, conteúdo em Markdown com front matter, deploy Netlify |
| **Diferencial** | Casos de estudo com profundidade (concorrência PostgreSQL, auditoria, equidade algorítmica), não apenas lista de tecnologias |
| **Estado** | Em evolução. Novos projectos são documentados à medida que são concluídos |
| **Posicionamento** | Engenheiro informático em crescimento, bases sólidas, sede de aprender |

---

## Stack do repositório

- Vue 3 · Vue Router · Vite · Tailwind CSS
- Marked + front-matter · DOMPurify
- Vitest + Vue Test Utils

## Funcionalidades

- Homepage com perfil, tecnologias e casos de estudo em destaque
- `/portfolio` com casos de estudo (Markdown + front matter)
- `/blog` com pesquisa e paginação
- Navegação entre entradas (anterior / seguinte)
- Imagens locais por post ou projecto
- Script de preview para screenshots pesados
- Modo escuro

## Estrutura

```text
src/
  portfolio-items/    Casos de estudo e assets
  blogs-posts/        Artigos e assets por post
  components/         Componentes Vue
  router/             Rotas
  services/           Parsing, sanitização e utilitários
public/               Assets estáticos (incl. figuras de case studies)
scripts/              Scripts de manutenção de conteúdo
```

## Desenvolvimento local

```bash
npm install
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção
npm test         # testes
```

### Novo caso de estudo

Criar `src/portfolio-items/<slug>/index.md`:

```yaml
---
title: Título completo do projecto
shortTitle: Título curto para listagens
description: Resumo para SEO e cards
category: academia   # ou corporativo
stack: [FastAPI, PostgreSQL]
tags: [tag-1, tag-2]
date: 2025-06-01
featured: true       # opcional: destaque na homepage
---
```

### Novo artigo de blog

Criar `src/blogs-posts/<slug>/index.md` com `title`, `description`, `tags` e `date`. O nome da pasta torna-se o slug da URL.

### Previews de imagens

```bash
npm run images:preview -- "src/blogs-posts/<slug>"
```

---

## Notas de engenharia

Projecto mantido de forma simples e pessoal: file-based content, testes nos fluxos críticos, sem over-engineering. O objectivo é um site operável, legível e honesto sobre o ponto da carreira em que estou.

**Direcção:** sistemas compreensíveis, dados íntegros, código que responde a problemas reais.

---

Engenheiro informático em crescimento · [LinkedIn](https://www.linkedin.com/in/bungaantonio) · [bungaantonio.tech](https://www.bungaantonio.tech)

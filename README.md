# Bunga António · Portfólio & Blog Técnico

[![Site](https://img.shields.io/badge/site-bungaantonio.tech-0ea5e9?style=for-the-badge)](https://www.bungaantonio.tech)
[![HTML Sanitized](https://img.shields.io/badge/renderização-DOMPurify%20sanitized-16a34a?style=for-the-badge&logo=shield&logoColor=white)](https://github.com/bungaantonio/bungaantonio-portfolio-legacy/blob/main/src/services/sanitizeHtml.js)
[![Tests](https://img.shields.io/badge/testes-Vitest-646cff?style=for-the-badge&logo=vitest&logoColor=white)](https://github.com/bungaantonio/bungaantonio-portfolio-legacy)
[![Vue 3](https://img.shields.io/badge/Vue-3-42b883?style=for-the-badge&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Deploy](https://img.shields.io/badge/deploy-Netlify-00c7b7?style=for-the-badge&logo=netlify&logoColor=white)](https://www.netlify.com/)

Portfólio pessoal e blog técnico construído com Vue 3, Vite e Tailwind CSS. O site regista a minha evolução como IT Infrastructure Engineer: casos de estudo, intervenções técnicas e reflexões operacionais em crescimento.

**Live:** [bungaantonio.tech](https://www.bungaantonio.tech) · **Portfólio:** [/portfolio](https://www.bungaantonio.tech/portfolio) · **Blog:** [/blog](https://www.bungaantonio.tech/blog)

---

## Perfil

IT Infrastructure Engineer, focado na trajectória de crescimento para IT Infrastructure & Systems Engineer e, no longo prazo, Infrastructure & Systems Engineer. Trabalho com redes, sistemas, virtualização, automação operacional e ambientes corporativos Microsoft 365.

Tenho particular interesse na fiabilidade e continuidade operacional de infraestruturas físicas e cloud, na automatização de processos internos e na integração de sistemas de forma segura e rastreável.

### Áreas de interesse

| Área | Foco actual |
|------|-------------|
| **Infraestrutura & Redes** | Administração de ambientes físicos e cloud, configuração de rede e segurança de acessos |
| **Gestão de Identidade (IAM) & Auditoria** | Controlo de acesso por perfis, logs imutáveis e rastreabilidade operacional |
| **Automação & Scripting** | PowerShell, Bash, Power Automate — redução de processos manuais em ambientes corporativos |
| **Integração de Hardware & Sistemas** | Interligação de dispositivos físicos (biometria, impressão) com sistemas e APIs |

### Tecnologias (uso frequente)

- **Infraestrutura & Virtualização:** Docker, VMware, Hyper-V
- **Redes & Segurança:** TCP/IP, VLANs, Firewalls, SSH
- **Sistemas & Automação:** Linux, Windows Server, PowerShell, Bash
- **Dados & Integração:** PostgreSQL, Microsoft 365, Power Automate

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
| **Posicionamento** | IT Infrastructure Engineer em crescimento, bases sólidas em sistemas e redes, foco em operações e automação |

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

**Direcção:** infraestruturas fiáveis, operações estáveis, automatização que responde a problemas reais.

---

IT Infrastructure Engineer · [LinkedIn](https://www.linkedin.com/in/bungaantonio) · [bungaantonio.tech](https://www.bungaantonio.tech)

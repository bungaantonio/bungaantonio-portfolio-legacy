# Bunga António Portfolio

Personal portfolio and technical blog built with Vue 3, Vite, and Tailwind CSS.

This project is an extension of how I think about software and systems work: practical, structured, and responsible. I am interested in systems that must remain clear, reliable, and consistent under real operating conditions, not only in controlled demos.

## Profile

I work on the development, operation, and integration of systems, focusing on solutions that remain consistent and reliable in real-world environments.

I have practical experience in system operation and maintenance, including servers, networks, and system integration.

I am interested in organizational and high-throughput systems, with focus on:

- process modeling and business rules
- access control and identity
- traceability and auditing
- system integration

I am consolidating backend and systems engineering skills, with a focus on technical responsibility and participation in architecture decisions.

## Purpose

This repository has two main goals:

- present my professional profile in a clear and direct way
- publish technical writing, implementation notes, and system-oriented reflections

## Stack

- Vue 3
- Vue Router
- Vite
- Tailwind CSS
- Marked + front-matter
- DOMPurify
- Vitest + Vue Test Utils

## Current Capabilities

- portfolio landing page
- blog index with search and pagination
- markdown-based posts with front matter
- post-to-post navigation
- local image support per post directory
- preview-image workflow for heavy screenshots
- sanitized HTML rendering for markdown content
- tests for core service and key UI flows

## Project Structure

```text
src/
  blogs-posts/        Blog posts and post-specific assets
  components/         Vue components
  router/             Route definitions
  services/           Parsing, formatting, and content utilities
public/               Static public assets
scripts/              Local maintenance and content helper scripts
```

## Requirements

- Node.js 20+ recommended
- npm 10+
- Windows PowerShell for the image preview helper script

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Run tests:

```bash
npm test
```

## Writing a New Post

Create a directory in `src/blogs-posts/<slug>/` and add an `index.md` file:

```md
---
title: Post title
description: Short and clear summary
tags: [tag-1, tag-2]
date: 2026-04-11
---

Write the article in Markdown here.
```

The folder name becomes the post slug.

If a post needs screenshots or images, keep them inside the same post directory. This keeps each article self-contained and easier to maintain.

## Generating Image Previews

For screenshot-heavy posts, generate lighter preview images with:

```bash
npm run images:preview -- "src/blogs-posts/11-04-2026-como-desenvolvi-o-qms"
```

You can also control width, quality, and overwrite behavior:

```bash
npm run images:preview -- "src/blogs-posts/11-04-2026-como-desenvolvi-o-qms" maxWidth=1600 quality=90 force
```

Recommended markdown pattern:

```md
[![Image caption](./image-preview.jpg)](./image-original.png)
```

In the blog UI, preview images load in the article, and the original image can be opened enlarged for closer inspection.

## Maintenance Notes

- Posts are loaded locally with `import.meta.glob`.
- Markdown is parsed and sanitized before rendering.
- Relative image paths are resolved from each post directory.
- The project uses `createWebHistory`, so deployment must provide an `index.html` fallback for routes such as `/blog/slug`.

## Engineering Notes

This is not meant to be an over-designed content system. The goal is to keep the project simple enough to maintain personally, while still making room for good structure, testing, and content organization.

The direction of the repository reflects the kind of work I want to grow into: systems that are understandable, operable, and dependable.

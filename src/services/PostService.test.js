import { describe, expect, it } from 'vitest';
import { PostService, formatDate, getExcerpt, normalizeTags } from './PostService';

const mockModules = {
    '../blogs-posts/older-post/index.md': `---
title: Older Post
description: Post mais antigo para validar ordenação.
tags: [legacy]
date: 2024-01-01
---

Conteúdo antigo`,
    '../blogs-posts/newer-post/index.md': `---
title: Newer Post
description: Post mais recente para validar ordenação.
tags: [release, update]
date: 2025-01-01
---

Conteúdo recente`,
};

describe('PostService helpers', () => {
    it('formatDate devolve fallback para datas inválidas', () => {
        expect(formatDate('invalida')).toBe('Data indisponível');
    });

    it('getExcerpt corta textos longos', () => {
        expect(getExcerpt('a'.repeat(151))).toBe(`${'a'.repeat(150)}...`);
    });

    it('normalizeTags devolve array vazio quando tags são inválidas', () => {
        expect(normalizeTags(null)).toEqual([]);
    });
});

describe('PostService', () => {
    it('ordena os posts do mais recente para o mais antigo', async () => {
        const service = new PostService(mockModules);

        const posts = await service.loadPosts();

        expect(posts.map((post) => post.id)).toEqual(['newer-post', 'older-post']);
        expect(posts[0].formattedDate).not.toBe('');
    });

    it('devolve um post pelo id e null para ids inexistentes', async () => {
        const service = new PostService(mockModules);

        await expect(service.getPost('newer-post')).resolves.toMatchObject({
            title: 'Newer Post',
            tags: ['release', 'update'],
        });
        await expect(service.getPost('missing-post')).resolves.toBeNull();
    });

    it('filtra posts marcados como rascunho ou nao publicados', async () => {
        const mockModulesWithDrafts = {
            ...mockModules,
            '../blogs-posts/draft-post/index.md': `---
title: Draft Post
draft: true
date: 2025-02-01
---
Conteudo rascunho`,
            '../blogs-posts/status-draft-post/index.md': `---
title: Status Draft Post
status: draft
date: 2025-02-02
---
Conteudo rascunho status`,
            '../blogs-posts/unpublished-post/index.md': `---
title: Unpublished Post
published: false
date: 2025-02-03
---
Conteudo nao publicado`,
        };

        const service = new PostService(mockModulesWithDrafts);
        const posts = await service.loadPosts();

        expect(posts.map((post) => post.id)).toEqual(['newer-post', 'older-post']);
        
        // Assegura também que getPost retorne null para posts de rascunho filtrados
        await expect(service.getPost('draft-post')).resolves.toBeNull();
    });

    it('resolve assets relativos a partir da pasta do post', () => {
        const service = new PostService(mockModules, {
            '../blogs-posts/newer-post/capa.png': '/assets/capa.png',
            '../blogs-posts/newer-post/imagem com espaco.png': '/assets/imagem-com-espaco.png',
            '../blogs-posts/newer-post/demo.mp4': '/assets/demo.mp4',
        });

        expect(service.resolveAssetPath({ sourceDir: '../blogs-posts/newer-post' }, './capa.png')).toBe('/assets/capa.png');
        expect(service.resolveAssetPath({ sourceDir: '../blogs-posts/newer-post' }, '<./imagem%20com%20espaco.png>')).toBe('/assets/imagem-com-espaco.png');
        expect(service.resolveAssetPath({ sourceDir: '../blogs-posts/newer-post' }, './demo.mp4')).toBe('/assets/demo.mp4');
        expect(service.resolveAssetPath({ sourceDir: '../blogs-posts/newer-post' }, 'https://example.com/image.png')).toBe('https://example.com/image.png');
    });
});

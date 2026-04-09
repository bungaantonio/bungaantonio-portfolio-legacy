import { describe, expect, it } from 'vitest';
import { PostService, formatDate, getExcerpt, normalizeTags } from './PostService';

const mockModules = {
    '../blogs-posts/older-post.md': `---
title: Older Post
description: Post mais antigo para validar ordenação.
tags: [legacy]
date: 2024-01-01
---

Conteúdo antigo`,
    '../blogs-posts/newer-post.md': `---
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
});

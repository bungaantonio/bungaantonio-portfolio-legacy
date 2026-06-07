import { describe, expect, it } from 'vitest';
import { PortfolioService } from './PortfolioService';

const mockModules = {
    '../portfolio-items/older-project/index.md': `---
title: Older Project
description: Projeto mais antigo para validar ordenação.
category: academia
stack: [PostgreSQL]
tags: [legacy]
date: 2024-01-01
---

Conteúdo antigo`,
    '../portfolio-items/newer-project/index.md': `---
title: Newer Project
description: Projeto mais recente para validar ordenação.
category: corporativo
stack: [NestJS, PostgreSQL]
tags: [mvp]
date: 2025-01-01
---

Conteúdo recente`,
};

describe('PortfolioService', () => {
    it('ordena os projetos do mais recente para o mais antigo', async () => {
        const service = new PortfolioService(mockModules);

        const items = await service.loadItems();

        expect(items.map((item) => item.id)).toEqual(['newer-project', 'older-project']);
        expect(items[0].stack).toEqual(['NestJS', 'PostgreSQL']);
        expect(items[0].category).toBe('corporativo');
    });

    it('devolve um projeto pelo id e null para ids inexistentes', async () => {
        const service = new PortfolioService(mockModules);

        await expect(service.getItem('newer-project')).resolves.toMatchObject({
            title: 'Newer Project',
            tags: ['mvp'],
        });
        await expect(service.getItem('missing-project')).resolves.toBeNull();
    });

    it('filtra projetos marcados como rascunho ou nao publicados', async () => {
        const mockModulesWithDrafts = {
            ...mockModules,
            '../portfolio-items/draft-project/index.md': `---
title: Draft Project
draft: true
date: 2025-02-01
---
Conteudo rascunho`,
        };

        const service = new PortfolioService(mockModulesWithDrafts);
        const items = await service.loadItems();

        expect(items.map((item) => item.id)).toEqual(['newer-project', 'older-project']);
        await expect(service.getItem('draft-project')).resolves.toBeNull();
    });

    it('resolve assets relativos a partir da pasta do projeto', () => {
        const service = new PortfolioService(mockModules, {
            '../portfolio-items/newer-project/diagrama.png': '/assets/diagrama.png',
        });

        expect(service.resolveAssetPath({ sourceDir: '../portfolio-items/newer-project' }, './diagrama.png')).toBe('/assets/diagrama.png');
        expect(service.resolveAssetPath({ sourceDir: '../portfolio-items/newer-project' }, 'https://example.com/image.png')).toBe('https://example.com/image.png');
    });
});

import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PortfolioIndex from './PortfolioIndex.vue';
import PortfolioService from '../services/PortfolioService';

vi.mock('../services/PortfolioService', () => ({
    default: {
        loadItems: vi.fn(),
    },
}));

describe('PortfolioIndex', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('mostra mensagem de erro quando os projetos falham', async () => {
        PortfolioService.loadItems.mockRejectedValueOnce(new Error('boom'));

        const wrapper = mount(PortfolioIndex, {
            global: {
                stubs: {
                    Pagination: true,
                    RouterLink: true,
                },
            },
        });

        await new Promise((resolve) => setTimeout(resolve, 0));
        await wrapper.vm.$nextTick();

        expect(wrapper.text()).toContain('Ocorreu um erro ao carregar os projetos');
    });

    it('filtra projetos pela pesquisa', async () => {
        PortfolioService.loadItems.mockResolvedValueOnce([
            {
                id: 'gestao-filas-tempo-real',
                title: 'Sistema Web de Gestão de Filas',
                description: 'Arquitetura N-Tier com auditoria imutável',
                excerpt: 'Arquitetura N-Tier com auditoria imutável',
                body: 'RLS e hash chaining',
                category: 'academia',
                stack: ['FastAPI', 'PostgreSQL'],
                tags: ['RLS'],
            },
            {
                id: 'sequencias-documentais-institucionais',
                title: 'Sistema de Sequências Documentais',
                description: 'MVP interno para referências documentais',
                excerpt: 'MVP interno para referências documentais',
                body: 'SELECT FOR UPDATE',
                category: 'corporativo',
                stack: ['NestJS'],
                tags: ['concorrência'],
            },
        ]);

        const wrapper = mount(PortfolioIndex, {
            global: {
                stubs: {
                    Pagination: true,
                    RouterLink: true,
                },
            },
        });

        await new Promise((resolve) => setTimeout(resolve, 0));
        await wrapper.vm.$nextTick();

        const input = wrapper.find('input[type="search"]');
        await input.setValue('filas');

        expect(wrapper.vm.filteredItems).toHaveLength(1);
        expect(wrapper.vm.filteredItems[0].title).toContain('Filas');
        expect(wrapper.text()).toContain('1 resultado');
    });
});

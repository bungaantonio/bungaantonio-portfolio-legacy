import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import BlogIndex from './BlogIndex.vue';
import PostService from '../services/PostService';

vi.mock('../services/PostService', () => ({
    default: {
        loadPosts: vi.fn(),
        formatDate: vi.fn((date) => date),
    },
}));

describe('BlogIndex', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('mostra mensagem de erro quando os posts falham', async () => {
        PostService.loadPosts.mockRejectedValueOnce(new Error('boom'));

        const wrapper = mount(BlogIndex, {
            global: {
                stubs: {
                    Pagination: true,
                    RouterLink: true,
                },
            },
        });

        await new Promise((resolve) => setTimeout(resolve, 0));
        await wrapper.vm.$nextTick();

        expect(wrapper.text()).toContain('Ocorreu um erro ao carregar os posts');
    });

    it('filtra posts pela pesquisa', async () => {
        PostService.loadPosts.mockResolvedValueOnce([
            {
                id: 'post-qms',
                title: 'Como Desenvolvi o QMS',
                description: 'Decisões do projeto',
                excerpt: 'Decisões do projeto',
                body: 'Interface, fluxo e arquitetura',
                tags: ['qms', 'produto'],
                formattedDate: '2026-04-11',
            },
            {
                id: 'post-ssd',
                title: 'Instalando SSD NVMe Gen4 no Dell Latitude 7480',
                description: 'Upgrade de hardware',
                excerpt: 'Upgrade de hardware',
                body: 'Compatibilidade NVMe',
                tags: ['hardware'],
                formattedDate: '2025-04-09',
            },
        ]);

        const wrapper = mount(BlogIndex, {
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
        await input.setValue('qms');

        expect(wrapper.vm.filteredPosts).toHaveLength(1);
        expect(wrapper.vm.filteredPosts[0].title).toBe('Como Desenvolvi o QMS');
        expect(wrapper.text()).not.toContain('Upgrade de hardware');
        expect(wrapper.text()).toContain('1 resultado');
        expect(wrapper.html()).toContain('search-highlight');
    });
});

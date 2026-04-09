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
});

import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import BlogPost from './BlogPost.vue';
import PostService from '../services/PostService';

vi.mock('../services/PostService', () => ({
    default: {
        loadPosts: vi.fn(),
        getPost: vi.fn(),
        formatDate: vi.fn((date) => date),
    },
}));

describe('BlogPost', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        document.title = 'Base title';
        document.head.innerHTML = '<meta name="description" content="base description">';
        Object.assign(navigator, {
            clipboard: {
                writeText: vi.fn().mockResolvedValue(),
            },
        });
    });

    it('sanitiza o html renderizado a partir do markdown', async () => {
        PostService.loadPosts.mockResolvedValueOnce([
            { id: 'safe-post', title: 'Safe Post' },
        ]);
        PostService.getPost.mockResolvedValueOnce({
            id: 'safe-post',
            title: 'Safe Post',
            description: 'Conteúdo seguro',
            date: '2025-01-01',
            tags: ['seguranca'],
            body: 'Texto <img src="x" onerror="alert(1)" /> final',
        });

        const wrapper = mount(BlogPost, {
            global: {
                stubs: {
                    NavigationLinks: true,
                    RouterLink: true,
                },
                mocks: {
                    $route: {
                        params: { postId: 'safe-post' },
                    },
                },
            },
        });

        await new Promise((resolve) => setTimeout(resolve, 0));
        await wrapper.vm.$nextTick();

        expect(wrapper.html()).toContain('<img src="x">');
        expect(wrapper.html()).not.toContain('onerror=');
        expect(document.title).toBe('Safe Post | Bunga António');
    });

    it('adiciona uma toolbar com botão de copiar aos blocos de código', async () => {
        PostService.loadPosts.mockResolvedValueOnce([]);
        PostService.getPost.mockResolvedValueOnce({
            id: 'code-post',
            title: 'Code Post',
            description: 'Post com snippet',
            date: '2025-01-01',
            tags: ['codigo'],
            body: '```bash\nnpm run dev\n```',
        });

        const wrapper = mount(BlogPost, {
            global: {
                stubs: {
                    NavigationLinks: true,
                    RouterLink: true,
                },
                mocks: {
                    $route: {
                        params: { postId: 'code-post' },
                    },
                },
            },
        });

        const container = document.createElement('div');
        container.innerHTML = '<pre><code class="language-bash">npm run dev</code></pre>';

        BlogPost.methods.addCopyButtons.call({
            $refs: { postContent: container },
            getCodeLanguage: BlogPost.methods.getCodeLanguage,
            copyCodeToClipboard: BlogPost.methods.copyCodeToClipboard,
        });

        expect(container.querySelector('.code-copy-toolbar')).not.toBeNull();
        expect(container.querySelector('.code-copy-language')?.textContent).toBe('BASH');
        expect(container.querySelector('.code-copy-btn')?.textContent).toBe('Copiar');
    });
});

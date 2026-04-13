import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import BlogPost from './BlogPost.vue';
import PostService from '../services/PostService';

vi.mock('../services/PostService', () => ({
    default: {
        loadPosts: vi.fn(),
        getPost: vi.fn(),
        formatDate: vi.fn((date) => date),
        resolveAssetPath: vi.fn((_, path) => path),
    },
}));

describe('BlogPost', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        document.title = 'Base title';
        document.head.innerHTML = '<meta name="description" content="base description">';
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

        expect(wrapper.html()).toContain('<img src="x"');
        expect(wrapper.html()).not.toContain('onerror=');
        expect(document.title).toBe('Safe Post | Bunga António');
    });

    it('abre imagens do post em lightbox com o asset resolvido', async () => {
        PostService.resolveAssetPath.mockImplementation((_, path) => {
            if (path.includes('preview')) {
                return '/assets/qms-preview.jpg';
            }

            if (path.includes('2025-11-30_135808.png')) {
                return '/assets/qms-full.png';
            }

            return path;
        });

        PostService.loadPosts.mockResolvedValueOnce([
            { id: 'qms-post', title: 'QMS Post' },
        ]);
        PostService.getPost.mockResolvedValueOnce({
            id: 'qms-post',
            title: 'QMS Post',
            description: 'Conteúdo com imagem',
            date: '2026-04-11',
            tags: ['qms'],
            body: '[![Imagem QMS](./2025-11-30_135808-preview.jpg)](./2025-11-30_135808.png)',
        });

        const wrapper = mount(BlogPost, {
            global: {
                stubs: {
                    NavigationLinks: true,
                    RouterLink: true,
                },
                mocks: {
                    $route: {
                        params: { postId: 'qms-post' },
                    },
                },
            },
        });

        await new Promise((resolve) => setTimeout(resolve, 0));
        await wrapper.vm.$nextTick();

        const image = wrapper.find('img[alt="Imagem QMS"]');
        expect(image.exists()).toBe(true);
        expect(image.attributes('loading')).toBe('lazy');

        await image.trigger('click');

        const lightboxImage = wrapper.find('.lightbox__image');
        expect(lightboxImage.exists()).toBe(true);
        expect(lightboxImage.attributes('src')).toBe('/assets/qms-full.png');
    });

    it('resolve videos locais e embeds externos no conteúdo do post', async () => {
        PostService.resolveAssetPath.mockImplementation((_, path) => {
            if (path.includes('demo.mp4')) {
                return '/assets/demo.mp4';
            }

            return path;
        });

        PostService.loadPosts.mockResolvedValueOnce([
            { id: 'video-post', title: 'Video Post' },
        ]);
        PostService.getPost.mockResolvedValueOnce({
            id: 'video-post',
            title: 'Video Post',
            description: 'Conteúdo com vídeo',
            date: '2026-04-11',
            tags: ['video'],
            body: `
<video src="./demo.mp4" poster="./cover.jpg"></video>
<iframe src="https://www.youtube.com/embed/example"></iframe>`,
        });

        const wrapper = mount(BlogPost, {
            global: {
                stubs: {
                    NavigationLinks: true,
                    RouterLink: true,
                },
                mocks: {
                    $route: {
                        params: { postId: 'video-post' },
                    },
                },
            },
        });

        await new Promise((resolve) => setTimeout(resolve, 0));
        await wrapper.vm.$nextTick();

        const video = wrapper.find('video');
        expect(video.exists()).toBe(true);
        expect(video.attributes('src')).toBe('/assets/demo.mp4');
        expect(video.attributes('controls')).toBeDefined();
        expect(video.attributes('preload')).toBe('metadata');

        const iframeWrapper = wrapper.find('.post-embed');
        expect(iframeWrapper.exists()).toBe(true);
        expect(wrapper.find('iframe').attributes('loading')).toBe('lazy');
    });
});

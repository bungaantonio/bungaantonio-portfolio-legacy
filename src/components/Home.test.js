import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import Home from './Home.vue';
import PortfolioService from '../services/PortfolioService';

vi.mock('../services/PortfolioService', () => ({
    default: {
        loadItems: vi.fn().mockResolvedValue([]),
    },
}));

describe('Home', () => {
    it('reflete a trajetória de infraestrutura e sistemas em vez de desenvolvimento', async () => {
        const wrapper = mount(Home, {
            global: {
                stubs: {
                    RouterLink: true,
                },
            },
        });

        await wrapper.vm.$nextTick();

        const text = wrapper.text();

        expect(text).toContain('IT Infrastructure Engineer');
        expect(text).toContain('IT Infrastructure & Systems Engineer');
        expect(text).toContain('Infrastructure & Systems Engineer');
        expect(text).not.toContain('Desenvolvimento');
        expect(text).not.toContain('desenvolvimento');
        expect(text).toContain('Estou a consolidar a minha trajetória');
        expect(text).toContain('Infraestrutura & Redes');
        expect(text).toContain('Virtualização & Cloud');
        expect(text).toContain('Automação & Operação');
        expect(text).toContain('Segurança, IAM & Auditoria');
    });
});

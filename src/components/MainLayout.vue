<template>
    <div class="min-h-screen bg-accent dark:bg-secondary-900 flex flex-col transition-colors duration-400">
        <TopBarComponent />
        <div class="container mx-auto px-6 py-12 pt-28 min-h-[600px] flex-grow section-spacing">
            <slot />
        </div>
        <TechMarqueeFooter />
    </div>
</template>
<script>
import TopBarComponent from './TopBarComponent.vue';
import TechMarqueeFooter from './TechMarqueeFooter.vue';

export default {
    components: {
        TopBarComponent,
        TechMarqueeFooter,
    },
    data() {
        return {
        };
    },
    methods: {
    },
};
</script>

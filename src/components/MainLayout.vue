<template>
    <div class="min-h-screen bg-accent dark:bg-secondary-900 flex flex-col transition-colors duration-400">
        <TopBarComponent />
        <div class="container mx-auto px-6 py-12 min-h-[600px] flex-grow section-spacing">
            <slot />
        </div>
    </div>
</template>
<script>
import TopBarComponent from './TopBarComponent.vue';

export default {
    components: {
        TopBarComponent
    },
    data() {
        return {
        };
    },
    methods: {
    },
};
</script>

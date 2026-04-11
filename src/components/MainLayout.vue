<template>
    <div class="min-h-screen bg-accent flex flex-col">
        <TopBarComponent />
        <div class="container mx-auto px-6 py-12 min-h-[600px] flex-grow">
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

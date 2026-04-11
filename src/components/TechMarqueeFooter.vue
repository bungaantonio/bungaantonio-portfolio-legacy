<template>
    <footer class="tech-marquee-footer" aria-label="Technology marquee footer">
        <div class="tech-marquee-footer__fade tech-marquee-footer__fade--left" aria-hidden="true"></div>
        <div class="tech-marquee-footer__fade tech-marquee-footer__fade--right" aria-hidden="true"></div>

        <div class="tech-marquee-footer__track" aria-hidden="true">
            <div class="tech-marquee-footer__rail">
                <span
                    v-for="(item, index) in repeatedItems"
                    :key="`${item}-${index}`"
                    class="tech-marquee-footer__item"
                >
                    {{ item }}
                </span>
            </div>
        </div>
    </footer>
</template>

<script setup>
const items = [
    'System Integration',
    'IAM',
    'Audit Trails',
    'Backend',
    'Business Rules',
    'Architecture',
    'Infrastructure',
    'Traceability',
    'Reliability',
    'Operations',
];

const repeatedItems = [...items, ...items];
</script>

<style scoped>
.tech-marquee-footer {
    @apply relative mt-6 overflow-hidden border-t border-secondary-200/80 bg-transparent py-3 dark:border-secondary-700/80;
}

.tech-marquee-footer__track {
    @apply overflow-hidden;
}

.tech-marquee-footer__rail {
    display: flex;
    width: max-content;
    animation: tech-marquee 28s linear infinite;
}

.tech-marquee-footer__item {
    @apply mx-2 inline-flex items-center rounded-full border border-secondary-200/80 bg-card-bg/75 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-secondary-500 shadow-sm backdrop-blur-sm dark:border-secondary-700/80 dark:bg-secondary-800/70 dark:text-secondary-300;
}

.tech-marquee-footer__item::before {
    content: '';
    @apply mr-3 inline-block h-1.5 w-1.5 rounded-full bg-primary;
}

.tech-marquee-footer__fade {
    @apply pointer-events-none absolute inset-y-0 z-[1] w-12;
}

.tech-marquee-footer__fade--left {
    @apply left-0 bg-gradient-to-r from-accent via-accent/90 to-transparent dark:from-secondary-900 dark:via-secondary-900/90;
}

.tech-marquee-footer__fade--right {
    @apply right-0 bg-gradient-to-l from-accent via-accent/90 to-transparent dark:from-secondary-900 dark:via-secondary-900/90;
}

@keyframes tech-marquee {
    from {
        transform: translateX(0);
    }

    to {
        transform: translateX(-50%);
    }
}
</style>

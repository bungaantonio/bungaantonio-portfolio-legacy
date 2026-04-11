<template>
  <div class="reading-progress">
    <div class="reading-progress__bar" :style="{ transform: `scaleX(${progress})` }"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      progress: 0,
    };
  },
  methods: {
    updateProgress() {
      if (typeof window === 'undefined') return;
      const scrollTop = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      this.progress = docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0;
    },
  },
  mounted() {
    this.updateProgress();
    window.addEventListener('scroll', this.updateProgress, { passive: true });
    window.addEventListener('resize', this.updateProgress);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.updateProgress);
    window.removeEventListener('resize', this.updateProgress);
  },
};
</script>

<style scoped>
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 60;
  background: transparent;
}
.reading-progress__bar {
  width: 100%;
  height: 100%;
  transform-origin: left;
  background: rgba(59, 130, 246, 0.95);
  transition: transform 150ms ease-out;
}
</style>

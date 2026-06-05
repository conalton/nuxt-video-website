<script setup lang="ts">
import { computed } from 'vue'

const { t } = useI18n()
const { public: publicConfig } = useRuntimeConfig()
const cdnBase = (publicConfig.cdnBase as string).replace(/\/+$/, '')

const items = computed(() =>
  Array.from({ length: 18 }, (_, i) => {
    const n = i + 1
    return {
      n,
      title: t('gallery.item', { n }),
      src: `${cdnBase}/vp-${n}.jpg`
    }
  })
)
</script>

<template>
  <div class="container">
    <header class="page-head">
      <h1 class="page-head__title">{{ t('gallery.title') }}</h1>
      <p class="page-head__subtitle">{{ t('gallery.subtitle') }}</p>
    </header>

    <ul class="grid">
      <li v-for="item in items" :key="item.n" class="card">
        <div class="card__media">
          <img :src="item.src" :alt="item.title" loading="lazy" />
          <span class="card__play" aria-hidden="true">▶</span>
        </div>
        <div class="card__body">
          <span class="card__title">{{ item.title }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.page-head {
  margin-bottom: 24px;
}

.page-head__title {
  margin: 0 0 4px;
  font-size: 26px;
  font-weight: 700;
}

.page-head__subtitle {
  margin: 0;
  color: var(--text-muted);
  font-size: 14px;
}

.grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  transition:
    transform 0.15s,
    border-color 0.15s;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-2px);
  border-color: var(--primary);
}

.card__media {
  position: relative;
  aspect-ratio: 16 / 10;
  background: var(--surface-2);
  overflow: hidden;
}

.card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s;
}

.card:hover .card__media img {
  transform: scale(1.04);
}

.card__play {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: rgba(255, 255, 255, 0.92);
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.6);
  opacity: 0;
  transition: opacity 0.2s;
}

.card:hover .card__play {
  opacity: 1;
}

.card__body {
  padding: 10px 12px;
}

.card__title {
  font-size: 14px;
  color: var(--text);
}
</style>

<script setup lang="ts">
defineEmits<{
  (e: 'open-login' | 'open-register'): void
}>()

const { t } = useI18n()
</script>

<template>
  <header class="header">
    <div class="container header__inner">
      <NuxtLink to="/" class="header__brand">
        <span class="header__logo">▶</span>
        <span>{{ t('site.brand') }}</span>
      </NuxtLink>

      <nav class="header__nav">
        <LangSwitcher />
        <button class="btn btn--ghost" @click="$emit('open-login')">
          {{ t('nav.login') }}
        </button>
        <button class="btn btn--primary" @click="$emit('open-register')">
          {{ t('nav.register') }}
        </button>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(15, 17, 21, 0.85);
  backdrop-filter: saturate(180%) blur(10px);
  border-bottom: 1px solid var(--border);
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.header__brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--text);
  font-weight: 600;
  font-size: 18px;
}

.header__brand:hover {
  color: var(--text);
}

.header__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--primary), #8b5bff);
  color: #fff;
  font-size: 14px;
}

.header__nav {
  display: flex;
  gap: 10px;
}

@media (max-width: 480px) {
  .header__brand span:last-child {
    display: none;
  }
}
</style>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const { locale, locales, setLocale, t } = useI18n()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

const availableLocales = computed(() =>
  (locales.value as { code: string; name?: string }[]).filter((l) => l.code !== locale.value)
)

const currentLabel = computed(() => locale.value.toUpperCase())

async function pick(code: string) {
  open.value = false
  if (code === locale.value) return
  await setLocale(code as never)
}

function toggle() {
  open.value = !open.value
}

function onDocClick(e: MouseEvent) {
  if (!open.value) return
  if (root.value && !root.value.contains(e.target as Node)) {
    open.value = false
  }
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div ref="root" class="lang">
    <button
      type="button"
      class="lang__btn"
      :aria-label="t('locale.label')"
      :aria-expanded="open"
      aria-haspopup="listbox"
      @click="toggle"
    >
      <span class="lang__globe" aria-hidden="true">🌐</span>
      <span class="lang__code">{{ currentLabel }}</span>
      <span class="lang__caret" aria-hidden="true">▾</span>
    </button>

    <ul v-if="open" class="lang__menu" role="listbox">
      <li
        v-for="loc in availableLocales"
        :key="loc.code"
        class="lang__item"
        role="option"
        :aria-selected="false"
        @click="pick(loc.code)"
      >
        <span class="lang__item-code">{{ loc.code.toUpperCase() }}</span>
        <span class="lang__item-name">{{ loc.name }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.lang {
  position: relative;
}

.lang__btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 10px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text);
  font-size: 13px;
  font-weight: 500;
  transition: border-color 0.15s, color 0.15s;
}

.lang__btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.lang__globe {
  font-size: 14px;
  line-height: 1;
}

.lang__caret {
  font-size: 10px;
  color: var(--text-muted);
}

.lang__menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 140px;
  margin: 0;
  padding: 4px;
  list-style: none;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  z-index: 60;
}

.lang__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text);
}

.lang__item:hover {
  background: var(--surface-2);
  color: var(--primary);
}

.lang__item-code {
  font-weight: 600;
  font-size: 12px;
  color: var(--text-muted);
  min-width: 22px;
}
</style>

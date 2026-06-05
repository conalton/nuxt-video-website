<script setup lang="ts">
import { ref } from 'vue'

type AuthMode = 'login' | 'register'

const authModalOpen = ref(false)
const authMode = ref<AuthMode>('login')

function openAuth(mode: AuthMode) {
  authMode.value = mode
  authModalOpen.value = true
}

function closeAuth() {
  authModalOpen.value = false
}
</script>

<template>
  <div class="layout">
    <AppHeader @open-login="openAuth('login')" @open-register="openAuth('register')" />

    <main class="layout__main">
      <slot />
    </main>

    <AppFooter />

    <AuthModal
      v-if="authModalOpen"
      :mode="authMode"
      @close="closeAuth"
      @switch-mode="authMode = $event"
    />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout__main {
  flex: 1;
  padding: 32px 0 64px;
}
</style>

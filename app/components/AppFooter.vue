<script setup lang="ts">
const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container">
      <p class="footer__text">{{ t('footer.rights', { year }) }}</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--border);
  padding: 20px 0;
  background: var(--surface);
}

.footer__text {
  margin: 0;
  text-align: center;
  font-size: 13px;
  color: var(--text-muted);
}
</style>

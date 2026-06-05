<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

type AuthMode = 'login' | 'register'

const props = defineProps<{ mode: AuthMode }>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'switch-mode', mode: AuthMode): void
}>()

const { t } = useI18n()

const form = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirm: ''
})

const fieldErrors = reactive<Record<string, string>>({})
const serverMessage = ref<{ type: 'error' | 'info'; text: string } | null>(null)
const submitting = ref(false)

const isRegister = computed(() => props.mode === 'register')

watch(
  () => props.mode,
  () => {
    resetState()
  }
)

function clearFieldErrors() {
  for (const k of Object.keys(fieldErrors)) {
    Reflect.deleteProperty(fieldErrors, k)
  }
}

function resetState() {
  form.name = ''
  form.email = ''
  form.password = ''
  form.passwordConfirm = ''
  clearFieldErrors()
  serverMessage.value = null
  submitting.value = false
}

function validate(): boolean {
  clearFieldErrors()

  if (isRegister.value && !form.name.trim()) {
    fieldErrors.name = t('auth.errors.required')
  }

  if (!form.email.trim()) {
    fieldErrors.email = t('auth.errors.required')
  } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
    fieldErrors.email = t('auth.errors.email')
  }

  if (!form.password) {
    fieldErrors.password = t('auth.errors.required')
  } else if (form.password.length < 6) {
    fieldErrors.password = t('auth.errors.passwordShort')
  }

  if (isRegister.value && form.password !== form.passwordConfirm) {
    fieldErrors.passwordConfirm = t('auth.errors.passwordMismatch')
  }

  return Object.keys(fieldErrors).length === 0
}

async function submit() {
  serverMessage.value = null
  if (!validate()) return

  submitting.value = true
  try {
    const endpoint = isRegister.value ? '/api/auth/register' : '/api/auth/login'
    const body = isRegister.value
      ? { name: form.name, email: form.email, password: form.password }
      : { email: form.email, password: form.password }

    const res = await $fetch<{ ok: boolean; code?: string; message?: string }>(endpoint, {
      method: 'POST',
      body,
      ignoreResponseError: true
    })

    serverMessage.value = {
      type: res?.ok ? 'info' : 'error',
      text: resolveServerMessage(res)
    }
  } catch (err: unknown) {
    const e = err as { data?: { code?: string; message?: string }; statusMessage?: string } | null
    const text = resolveServerMessage(e?.data) ?? e?.statusMessage ?? t('auth.errors.network')
    serverMessage.value = { type: 'error', text }
  } finally {
    submitting.value = false
  }
}

function resolveServerMessage(
  data: { code?: string; message?: string } | null | undefined
): string {
  if (!data) return t('auth.errors.network')
  if (data.code) {
    const key = `auth.server.${data.code}`
    const translated = t(key)
    if (translated !== key) return translated
  }
  return data.message ?? t('auth.server.unknown')
}

function close() {
  emit('close')
}

function onBackdrop(e: MouseEvent) {
  if (e.target === e.currentTarget) close()
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('keydown', onKey)
  document.body.style.overflow = 'hidden'
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="modal" role="dialog" aria-modal="true" @mousedown="onBackdrop">
    <div class="modal__card">
      <button class="modal__close" type="button" aria-label="Close" @click="close">×</button>

      <h2 class="modal__title">
        {{ isRegister ? t('auth.registerTitle') : t('auth.loginTitle') }}
      </h2>

      <form class="form" @submit.prevent="submit">
        <div v-if="isRegister" class="form__group">
          <label class="form__label" for="auth-name">{{ t('auth.name') }}</label>
          <input
            id="auth-name"
            v-model="form.name"
            type="text"
            class="form__input"
            :class="{ 'form__input--error': fieldErrors.name }"
            :placeholder="t('auth.namePlaceholder')"
            autocomplete="name"
          />
          <span v-if="fieldErrors.name" class="form__error">{{ fieldErrors.name }}</span>
        </div>

        <div class="form__group">
          <label class="form__label" for="auth-email">{{ t('auth.email') }}</label>
          <input
            id="auth-email"
            v-model="form.email"
            type="email"
            class="form__input"
            :class="{ 'form__input--error': fieldErrors.email }"
            :placeholder="t('auth.emailPlaceholder')"
            autocomplete="email"
          />
          <span v-if="fieldErrors.email" class="form__error">{{ fieldErrors.email }}</span>
        </div>

        <div class="form__group">
          <label class="form__label" for="auth-password">{{ t('auth.password') }}</label>
          <input
            id="auth-password"
            v-model="form.password"
            type="password"
            class="form__input"
            :class="{ 'form__input--error': fieldErrors.password }"
            :placeholder="t('auth.passwordPlaceholder')"
            :autocomplete="isRegister ? 'new-password' : 'current-password'"
          />
          <span v-if="fieldErrors.password" class="form__error">{{ fieldErrors.password }}</span>
        </div>

        <div v-if="isRegister" class="form__group">
          <label class="form__label" for="auth-password2">{{ t('auth.passwordConfirm') }}</label>
          <input
            id="auth-password2"
            v-model="form.passwordConfirm"
            type="password"
            class="form__input"
            :class="{ 'form__input--error': fieldErrors.passwordConfirm }"
            autocomplete="new-password"
          />
          <span v-if="fieldErrors.passwordConfirm" class="form__error">{{
            fieldErrors.passwordConfirm
          }}</span>
        </div>

        <div
          v-if="serverMessage"
          class="form__notice"
          :class="`form__notice--${serverMessage.type}`"
          role="alert"
        >
          {{ serverMessage.text }}
        </div>

        <button type="submit" class="btn btn--primary btn--block" :disabled="submitting">
          {{
            submitting
              ? t('auth.loading')
              : isRegister
                ? t('auth.submitRegister')
                : t('auth.submitLogin')
          }}
        </button>

        <button
          type="button"
          class="form__switch"
          @click="emit('switch-mode', isRegister ? 'login' : 'register')"
        >
          {{ isRegister ? t('auth.switchToLogin') : t('auth.switchToRegister') }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.6);
  z-index: 100;
}

.modal__card {
  position: relative;
  width: 100%;
  max-width: 420px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: var(--shadow);
  padding: 28px 24px 24px;
}

.modal__close {
  position: absolute;
  top: 10px;
  right: 12px;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 24px;
  line-height: 1;
  border-radius: 6px;
}

.modal__close:hover {
  background: var(--surface-2);
  color: var(--text);
}

.modal__title {
  margin: 0 0 18px;
  font-size: 20px;
  font-weight: 600;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form__group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form__label {
  font-size: 13px;
  color: var(--text-muted);
}

.form__input {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text);
  transition: border-color 0.15s;
}

.form__input:focus {
  outline: none;
  border-color: var(--primary);
}

.form__input--error {
  border-color: var(--danger);
}

.form__error {
  font-size: 12px;
  color: var(--danger);
}

.form__notice {
  padding: 10px 12px;
  border-radius: var(--radius);
  font-size: 13px;
  border: 1px solid transparent;
}

.form__notice--error {
  background: rgba(255, 107, 107, 0.08);
  border-color: rgba(255, 107, 107, 0.4);
  color: var(--danger);
}

.form__notice--info {
  background: rgba(91, 140, 255, 0.08);
  border-color: rgba(91, 140, 255, 0.4);
  color: var(--primary);
}

.form__switch {
  margin-top: 4px;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 13px;
  padding: 6px;
}

.form__switch:hover {
  color: var(--primary);
}
</style>

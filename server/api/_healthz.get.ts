const startedAt = Date.now()

export default defineEventHandler(() => ({
  ok: true,
  uptimeMs: Date.now() - startedAt,
  ts: Date.now()
}))

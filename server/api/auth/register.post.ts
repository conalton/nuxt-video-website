export default defineEventHandler(async (event) => {
  // Read body to mimic a real handler (and consume the request stream).
  await readBody(event).catch(() => ({}))

  // Small artificial delay so the UI loading state is visible.
  await new Promise((resolve) => setTimeout(resolve, 400))

  setResponseStatus(event, 403)

  return {
    ok: false,
    code: 'INVITE_ONLY_REGISTER'
  }
})

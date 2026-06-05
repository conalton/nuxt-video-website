export default defineEventHandler(async (event) => {
  await readBody(event).catch(() => ({}))

  await new Promise((resolve) => setTimeout(resolve, 400))

  setResponseStatus(event, 401)

  return {
    ok: false,
    code: 'INVITE_ONLY_LOGIN'
  }
})

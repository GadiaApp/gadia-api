import env from '#start/env'

export default {
  cookies: {
    domain: env.get('COOKIE_DOMAIN'),
    secure: env.get('COOKIE_SECURE') === 'true',
    sameSite: 'lax' as const,
  },
  tls: { forceHttps: true },
}

export default {
  cookies: {
    domain: process.env.COOKIE_DOMAIN,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax' as const,
  },
  tls: { forceHttps: true },
}

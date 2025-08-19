import env from '#start/env'

export default {
  cookies: {
    domain: env.get('COOKIE_DOMAIN'),
    secure: env.get('COOKIE_SECURE') === 'true',
    sameSite: 'lax' as const,
  },
  tls: { forceHttps: true },
  jwt: {
    publicKey: env.get('JWT_PUBLIC_KEY_BASE64', ''),
    privateKey: env.get('JWT_PRIVATE_KEY_BASE64', ''),
    issuer: env.get('JWT_ISSUER', 'http://localhost'),
    audience: env.get('JWT_AUDIENCE'),
    accessTokenExpiration: env.get('JWT_ACCESS_TTL_SECONDS', '900'),
  },
  refreshToken: {
    expiration: env.get('REFRESH_TTL_SECONDS'),
    defaultDays: env.get('REFRESH_REMEMBER_DEFAULT_DAYS'),
  },
}

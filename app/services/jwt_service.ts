import { CryptoKey, importPKCS8, importSPKI, jwtVerify, SignJWT } from 'jose'
import security from '#config/security'

const privateKeyPem = security.jwt.privateKey
const publicKeyPem = security.jwt.publicKey

let PRIVATE_KEY: CryptoKey | null = null
let PUBLIC_KEY: CryptoKey | null = null

async function ensureKeys() {
  if (!PRIVATE_KEY) PRIVATE_KEY = await importPKCS8(privateKeyPem, 'RS256')
  if (!PUBLIC_KEY) PUBLIC_KEY = await importSPKI(publicKeyPem, 'RS256')
}

export type AccessPayload = {
  sub: string
  email?: string
  roles?: string[]
  mfa_ok?: boolean
  [k: string]: any
}

export default class JwtService {
  static async signAccessToken(payload: AccessPayload, ttlSeconds?: number): Promise<string> {
    await ensureKeys()
    const ttl = ttlSeconds || Number(security.jwt.accessTokenExpiration)
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: 'RS256' })
      .setIssuedAt()
      .setIssuer(security.jwt.issuer)
      .setAudience(security.jwt.audience!)
      .setExpirationTime(ttl)
      .sign(PRIVATE_KEY!)
  }

  static async verifyAccessToken(token: string): Promise<AccessPayload | null> {
    try {
      await ensureKeys()
      const { payload } = await jwtVerify(token, PUBLIC_KEY!, {
        issuer: security.jwt.issuer,
        audience: security.jwt.audience!,
      })
      return payload as AccessPayload
    } catch {
      return null
    }
  }
}

import { authenticator } from 'otplib'
import User from '#models/user'
import security from '#config/security'
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

export default class MfaService {
  static async generateSecret(user: User) {
    const secret = authenticator.generateSecret()

    user.mfaSecret = this.encryptForUser(user.id, secret)
    user.mfaKeyId = security.mfa.keyId
    await user.save()
    return secret
  }

  static otpAuthUri(userEmail: string, secret: string) {
    const issuer = security.mfa.issuer
    return authenticator.keyuri(userEmail, issuer, secret)
  }

  static verify(code: string, secret: string) {
    return authenticator.check(code, secret)
  }

  private static encryptForUser(userId: number, plaintext: Buffer | string) {
    const iv = randomBytes(12)
    const aad = Buffer.from(`totp:${userId}`)
    const cipher = createCipheriv('aes-256-gcm', security.mfa.key, iv)
    cipher.setAAD(aad)
    const enc = Buffer.concat([cipher.update(plaintext), cipher.final()])
    const tag = cipher.getAuthTag()
    return { enc, iv, tag, aad: aad.toString('utf8'), keyId: security.mfa.keyId }
  }

  private static decryptForUser(userId: number, enc: Buffer, iv: Buffer, tag: Buffer) {
    const aad = Buffer.from(`totp:${userId}`)
    const decipher = createDecipheriv('aes-256-gcm', security.mfa.key, iv)
    decipher.setAAD(aad)
    decipher.setAuthTag(tag)
    const out = Buffer.concat([decipher.update(enc), decipher.final()])
    return out.toString('utf8')
  }
}

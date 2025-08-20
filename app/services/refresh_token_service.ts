import { DateTime } from 'luxon'
import RefreshToken from '#models/refresh_token'
import security from '#config/security'
import { randomUUID } from 'node:crypto'

export default class RefreshTokenService {
  static defaultTtlSec() {
    return Number(security.refreshToken.expiration || 60 * 60 * 24 * 30)
  }

  static async issue(userId: number, rememberDays?: number) {
    const now = DateTime.now()
    const expiresAt = rememberDays
      ? now.plus({ days: rememberDays })
      : now.plus({ seconds: this.defaultTtlSec() })

    const token = randomUUID()
    await RefreshToken.create({
      userId,
      token,
      expiresAt,
    })
    return token
  }

  static async rotate(oldToken: string) {
    const rfToken = await RefreshToken.findBy('token', oldToken)
    if (!rfToken || rfToken.expiresAt < DateTime.now()) return null

    const newToken = randomUUID()
    rfToken.token = newToken
    rfToken.expiresAt = DateTime.now().plus({ seconds: this.defaultTtlSec() })
    await rfToken.save()

    return { newRefreshToken: newToken, userId: rfToken.userId }
  }

  static async revoke(token: string) {
    const t = await RefreshToken.findBy('token', token)
    if (t) {
      await t.delete()
      return true
    }
    return false
  }
}

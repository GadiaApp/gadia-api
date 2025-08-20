import { createHash, randomBytes } from 'node:crypto'
import ApiToken from '#models/api_token'
import { DateTime } from 'luxon'

function makePrefix() {
  return 'gad_' + randomBytes(4).toString('hex')
}
function makeSecret() {
  return randomBytes(24).toString('hex')
}
function sha256(s: string) {
  return createHash('sha256').update(s).digest('hex')
}

export default class ApiTokenService {
  static async create(name: string, userId: number | undefined, scopes: string[] = [], days = 365) {
    const prefix = makePrefix()
    const secret = makeSecret()
    const raw = `${prefix}.${secret}`
    await ApiToken.create({
      name,
      userId,
      token: sha256(raw),
      scopes,
      expiresAt: DateTime.now().plus({ days }),
    })
    return { token: raw }
  }

  static async verify(raw: string) {
    const rec = await ApiToken.query().where('hash', sha256(raw)).first()
    if (!rec) return null
    return rec
  }

  static async revoke(id: string) {
    const rec = await ApiToken.find(id)
    if (rec) {
      await rec.delete()
      return true
    }
    return false
  }
}

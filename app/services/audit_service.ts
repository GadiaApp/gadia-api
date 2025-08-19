import audit from '#config/audit'
import * as crypto from 'node:crypto'
import AuditLog from '#models/audit_log'

export default class AuditService {
  public static async record({
    userId = null,
    action,
    ressourceType = null,
    ressourceId = null,
    meta = {},
    sensitive = false,
  }: {
    userId?: number | null
    action: string
    ressourceType?: string | null
    ressourceId?: number | null
    meta?: any
    sensitive?: boolean
  }) {
    let safeMeta = AuditService._sanitizeMeta(meta)

    if (sensitive && audit.storePii) {
      const key = audit.piiEncryptionKey

      if (key && safeMeta && typeof safeMeta === 'object') {
        const iv = crypto.randomBytes(16)
        const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv)
        cipher.setAAD(Buffer.from(JSON.stringify(safeMeta), 'utf8'))
        cipher.setAutoPadding(true)
        let encrypted = cipher.update(JSON.stringify(safeMeta))
        encrypted = Buffer.concat([encrypted, cipher.final()])
        const tag = cipher.getAuthTag()
        safeMeta = {
          __encrypted: true,
          iv,
          tag: tag.toString('hex'),
          data: encrypted.toString('hex'),
        }
      }
    }

    return AuditLog.create({
      userId,
      action,
      ressourceType,
      ressourceId,
      meta: safeMeta,
      sensitive,
    })
  }

  private static _sanitizeMeta(meta: any) {
    if (!meta) return null

    const copy = { ...meta }
    if (copy?.body) delete copy.body
    if (copy?.password) delete copy.password
    if (copy?.ssn) delete copy.ssn
    if (copy.ip) copy.ip = AuditService._pseudonymizeIP(copy.ip)
    return copy
  }

  private static _pseudonymizeIP(ip: string) {
    if (!ip) return null
    const m = ip.match(/^(\d+\.\d+\.\d+)\.\d+$/)
    if (m) return `${m[1]}.0`
    return ip
  }
}

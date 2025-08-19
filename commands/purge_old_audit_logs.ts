import { BaseCommand } from '@adonisjs/core/ace'
import audit from '#config/audit'
import AuditLog from '#models/audit_log'

export default class PurgeOldAuditLogs extends BaseCommand {
  static commandName = 'audit:purge'
  static description = 'Purge audit logs older than GDPR_RETENTION_DAYS'

  async run() {
    const days = Number.parseInt(audit.gpdrRetentionDays)
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    this.logger.info(`Purging audit logs older than ${cutoff.toISOString()} (>= ${days} days)`)

    await AuditLog.query().where('created_at', '<', cutoff.toISOString()).delete()
    this.logger.info('Purge completed')
  }
}

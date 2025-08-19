import env from '#start/env'

export default {
  storePii: env.get('LOG_PII_STORE', 'false') === 'true',
  piiEncryptionKey: env.get('LOG_PII_ENCRYPTION_KEY', ''),
  gpdrRetentionDays: env.get('GPDR_RETENTION_DAYS', '180'),
}

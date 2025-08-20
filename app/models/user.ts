import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Role from '#models/role'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import RefreshToken from '#models/refresh_token'
import ApiToken from '#models/api_token'
import SsoIdentity from '#models/sso_identity'
import Device from '#models/device'
import LoginHistory from '#models/login_history'
import AuditLog from '#models/audit_log'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string | null

  @column()
  declare mfaEnabled: boolean

  @column({ serializeAs: null })
  declare mfaSecret: string | null

  @column({ serializeAs: null })
  declare mfaKeyId: string | null

  @column()
  declare roleId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>

  @hasMany(() => RefreshToken)
  declare refreshTokens?: HasMany<typeof RefreshToken>

  @hasMany(() => ApiToken)
  declare apiTokens?: HasMany<typeof ApiToken>

  @hasMany(() => SsoIdentity)
  declare ssoIdentities?: HasMany<typeof SsoIdentity>

  @hasMany(() => Device)
  declare devices?: HasMany<typeof Device>

  @hasMany(() => AuditLog)
  declare auditLogs?: HasMany<typeof AuditLog>

  @hasMany(() => LoginHistory)
  declare loginHistories?: HasMany<typeof LoginHistory>
}

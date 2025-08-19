import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Device from '#models/device'
import SsoProvider from '#models/sso_provider'

export default class LoginHistory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId?: number | null

  @column()
  declare loginMethod: 'password' | 'oidc' | 'saml' | 'api_token'

  @column()
  declare providerId?: number | null

  @column()
  declare success: boolean

  @column()
  declare ip: string

  @column()
  declare userAgent: string

  @column()
  declare deviceId?: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => SsoProvider)
  declare provider?: BelongsTo<typeof SsoProvider>

  @belongsTo(() => Device)
  declare device?: BelongsTo<typeof Device>
}

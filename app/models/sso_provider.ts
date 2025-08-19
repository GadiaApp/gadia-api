import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import LoginHistory from '#models/login_history'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import SsoIdentity from '#models/sso_identity'

export default class SsoProvider extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare type: 'oidc' | 'saml' | 'oauth2'

  @column()
  declare config: Record<string, any>

  @column()
  declare enabled: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => SsoIdentity)
  declare identities: HasMany<typeof SsoIdentity>

  @hasMany(() => LoginHistory)
  declare loginHistories: HasMany<typeof LoginHistory>
}

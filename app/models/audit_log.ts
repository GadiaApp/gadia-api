import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class AuditLog extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number | null

  @column()
  declare action: string

  @column()
  declare ressourceType: string | null

  @column()
  declare ressourceId: number | null

  @column()
  declare meta: any

  @column()
  declare sensitive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'userId',
    localKey: 'id',
  })
  declare user: BelongsTo<typeof User>
}

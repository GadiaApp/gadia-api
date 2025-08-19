import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'audit_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned().nullable().index()
      table.foreign('user_id').references('id').inTable('users').onDelete('SET NULL')

      table.string('action').notNullable().index()
      table.string('ressource_type').nullable().index()
      table.integer('ressource_id').unsigned().nullable().index()

      table.jsonb('meta').nullable()
      table.boolean('sensitive').notNullable().defaultTo(false)

      table.timestamp('created_at').defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('email').unique()
      table.string('password').nullable()
      table.boolean('mfa_enabled').defaultTo(false)
      table.string('mfa_secret').nullable()
      table.string('mfa_key_id').nullable()
      table.integer('role_id').unsigned().nullable()
      table.foreign('role_id').references('id').inTable('roles').onDelete('SET NULL')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

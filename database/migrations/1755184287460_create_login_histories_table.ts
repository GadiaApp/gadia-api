import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'login_histories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned().nullable()
      table.foreign('user_id').references('id').inTable('users').onDelete('SET NULL')

      table
        .enum('login_method', ['password', 'oidc', 'saml', 'api_token'])
        .notNullable()
        .defaultTo('password')

      table.integer('provider_id').unsigned().nullable()
      table.foreign('provider_id').references('id').inTable('sso_providers').onDelete('SET NULL')

      table.boolean('success').notNullable().defaultTo(true)
      table.string('ip').notNullable()
      table.string('user_agent').notNullable()
      table.string('device_id').nullable()
      table.foreign('device_id').references('id').inTable('devices').onDelete('SET NULL')

      table.timestamp('created_at')

      table.index(['user_id', 'created_at'], 'login_history_user_time_idx')
      table.index(['provider_id'], 'login_history_provider_idx')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

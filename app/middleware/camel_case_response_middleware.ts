import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class CamelCaseResponseMiddleware {
  static toCamelCase(key: string): string {
    return key.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase())
  }

  static convertKeysToCamelCase(input: any): any {
    if (Array.isArray(input)) {
      return input.map((item) => this.convertKeysToCamelCase(item))
    } else if (input !== null && typeof input === 'object') {
      return Object.fromEntries(
        Object.entries(input).map(([key, value]) => [
          this.toCamelCase(key),
          this.convertKeysToCamelCase(value),
        ])
      )
    }
    return input
  }

  async handle(ctx: HttpContext, next: NextFn) {
    await next()

    const res = ctx.response
    const body = res.getBody()

    const camelCased = CamelCaseResponseMiddleware.convertKeysToCamelCase(body)
    res.send(camelCased)
  }
}

import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import AuditService from '#services/audit_service'

export default class AuditMiddleware {
  async handle({ request, route, response }: HttpContext, next: NextFn) {
    const start = Date.now()
    await next()
    const duration = Date.now() - start

    // TODO: Replace with actual user ID retrieval logic
    const userId = null

    const meta = {
      method: request.method(),
      url: request.url(),
      route: route?.name || null,
      query: request.qs(),
      ip: request.ip(),
      ua: request.header('user-agent') || null,
      status: response.response.statusCode || response.getStatus(),
      duration: duration,
    }

    await AuditService.record({
      userId,
      action: `${request.method()}: ${route?.name || request.url()}`,
      ressourceType: route?.name || null,
      ressourceId: null,
      meta: meta,
      sensitive: false,
    })
  }
}

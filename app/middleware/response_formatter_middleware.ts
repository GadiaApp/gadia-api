import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { Readable } from 'node:stream'

export interface BasicResponse {
  requestId: string
}

export interface SuccessResponse extends BasicResponse {
  success: true
  data: unknown
}

export default class ResponseFormatterMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const originalSend = ctx.response.send.bind(ctx.response)

    ctx.response.send = (body: unknown) => {
      if (body && typeof body === 'object' && 'success' in (body as any)) return originalSend(body)

      if (body instanceof Readable || Buffer.isBuffer(body) || typeof body === 'string')
        return originalSend(body)

      return originalSend({
        success: true,
        requestId: ctx.request.id(),
        data: body ?? null,
      })
    }

    await next()
  }
}

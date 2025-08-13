import app from '@adonisjs/core/services/app'
import { ExceptionHandler, HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: any, ctx: HttpContext) {
    const requestId = ctx.request.id() as string
    const code = error.code || 'INTERNAL_SERVER_ERROR'
    const status = error.status || 500
    const message = error.message || 'An unexpected error occurred'

    logger.error(error)

    return ctx.response.status(status).send({
      success: false,
      requestId,
      error: {
        status,
        code,
        message,
        ...(this.debug && error.details ? { details: error.details } : {}),
      },
    })
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}

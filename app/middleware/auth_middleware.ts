import type { NextFn } from '@adonisjs/core/types/http'
import MissingAuthTokenException from '#exceptions/missing_auth_token_exception'
import JwtService from '#services/jwt_service'
import { HttpContext } from '@adonisjs/core/http'
import InvalidOrExpiredAuthTokenException from '#exceptions/invalid_or_expired_auth_token_exception'
import User from '#models/user'
import ApiTokenService from '#services/api_token_service'

export default class AuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const authHandler = ctx.request.header('authorization')

    if (!authHandler || !authHandler.startsWith('Bearer ')) {
      throw new MissingAuthTokenException()
    }

    const token = authHandler.replace('Bearer ', '').trim()
    let user: User | null = null

    try {
      const payload = await JwtService.verifyAccessToken(token)

      if (payload) {
        user = await User.find(payload.sub)

        if (user) {
          ctx.user = user
          ctx.authMethod = 'jwt'
          return next()
        }
      }
    } catch {}

    try {
      const apiToken = await ApiTokenService.verify(token)

      if (apiToken) {
        user = await apiToken.related('user').query().first()
        if (user) {
          ctx.user = user
          ctx.authMethod = 'apiToken'
          return next()
        }
      }
    } catch {}

    // ADD SSO HANDLING HERE (Service)

    throw new InvalidOrExpiredAuthTokenException()
  }
}

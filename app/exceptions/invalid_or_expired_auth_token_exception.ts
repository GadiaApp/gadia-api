import BaseException from '#exceptions/base_exception'

export default class InvalidOrExpiredAuthTokenException extends BaseException {
  static status = 401
  static code = 'INVALID_OR_EXPIRED_AUTH_TOKEN'
  static message = 'Invalid or expired authentication token'

  constructor(details?: Record<string, any>) {
    super(
      InvalidOrExpiredAuthTokenException.message,
      InvalidOrExpiredAuthTokenException.code,
      InvalidOrExpiredAuthTokenException.status,
      details
    )
  }
}

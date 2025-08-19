import BaseException from '#exceptions/base_exception'

export default class MissingAuthTokenException extends BaseException {
  static status = 401
  static code = 'MISSING_AUTH_TOKEN'
  static message = 'Missing authentication token'

  constructor(details?: Record<string, any>) {
    super(
      MissingAuthTokenException.message,
      MissingAuthTokenException.code,
      MissingAuthTokenException.status,
      details
    )
  }
}

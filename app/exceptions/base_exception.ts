import { Exception } from '@adonisjs/core/exceptions'
import { BasicResponse } from '#middleware/response_formatter_middleware'

export interface ErrorResponse extends BasicResponse {
  success: false
  error: {
    message: string
    code: string
    status: number
    details?: Record<string, any>
  }
}

export default class BaseException extends Exception {
  public code: string
  public status: number
  public details?: Record<string, any>

  constructor(message: string, code: string, status: number, details?: Record<string, any>) {
    super(message, { code, status })
    this.code = code
    this.status = status
    this.details = details
  }
}

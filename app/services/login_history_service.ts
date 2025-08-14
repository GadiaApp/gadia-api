import LoginHistory from '#models/login_history'

export class LoginHistoryService {
  public static async log({
    userId = null,
    loginMethod,
    providerId = null,
    success = true,
    ip,
    userAgent,
    deviceId = null,
  }: {
    userId?: number | null
    loginMethod: LoginHistory['loginMethod']
    providerId?: number | null
    success?: boolean
    ip: string
    userAgent: string
    deviceId?: string | null
  }) {
    return LoginHistory.create({
      userId,
      loginMethod,
      providerId,
      success,
      ip,
      userAgent,
      deviceId,
    })
  }
}

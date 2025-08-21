import User from '#models/user'

export default class RbacService {
  static async check(userId: string, requiredPerms: string[] = []) {
    if (requiredPerms.length === 0) return true
    const user = await User.query()
      .where('id', userId)
      .preload('role', (r) => r.preload('permissions'))
      .first()
    if (!user) return false

    const userPerms = new Set(user.role.permissions.map((p) => p.key))
    return requiredPerms.every((perm) => userPerms.has(perm))
  }
}

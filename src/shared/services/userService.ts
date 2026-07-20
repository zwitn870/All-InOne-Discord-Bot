import User, { IUser } from '../../database/models/User'

const cache = new Map<string, IUser>()

export async function getUser(userId: string, guildId: string): Promise<IUser> {
  const key = `${guildId}:${userId}`
  const cached = cache.get(key)
  if (cached) return cached

  let user = await User.findOne({ userId, guildId })
  if (!user) {
    user = await new User({ userId, guildId }).save()
  }

  cache.set(key, user)
  return user
}

export async function saveUser(user: IUser): Promise<void> {
  await user.save()
  cache.set(`${user.guildId}:${user.userId}`, user)
}

export async function getLeaderboard(guildId: string, sortField: 'xp' | 'wallet' | 'bank', limit = 10): Promise<IUser[]> {
  return User.find({ guildId }).sort({ [sortField]: -1 }).limit(limit)
}

export function invalidateCache(userId: string, guildId: string) {
  cache.delete(`${guildId}:${userId}`)
}

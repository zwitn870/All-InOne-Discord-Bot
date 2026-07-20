import Guild, { IGuild } from '../../database/models/Guild'

const cache = new Map<string, IGuild>()

export async function getGuild(guildId: string): Promise<IGuild> {
  const cached = cache.get(guildId)
  if (cached) return cached

  let guild = await Guild.findOne({ guildId })
  if (!guild) {
    guild = await new Guild({ guildId }).save()
  }

  cache.set(guildId, guild)
  return guild
}

export function invalidateCache(guildId: string) {
  cache.delete(guildId)
}

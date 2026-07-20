import { Events, Message } from 'discord.js'
import { Client } from '../../../core/Client'
import { getUser, saveUser } from '../../../shared/services/userService'
import { getGuild } from '../../../shared/services/guildService'

function xpForLevel(level: number): number {
  return (level + 1) * 100
}

export default {
  name: Events.MessageCreate,
  async execute(client: Client, message: Message) {
    if (message.author.bot || !message.guildId) return

    const guild = await getGuild(message.guildId)
    if (!guild.leveling.enabled) return

    const userData = await getUser(message.author.id, message.guildId)
    userData.totalMessages++

    const xpGain = Math.floor(Math.random() * 10) + guild.leveling.messageXp
    userData.xp += Math.floor(xpGain * guild.leveling.multiplier)

    const needed = xpForLevel(userData.level)
    if (userData.xp >= needed) {
      userData.level++
      userData.xp -= needed

      const roleRewards = guild.leveling.levelRoles.filter(r => r.level === userData.level)
      const member = message.guild?.members.cache.get(message.author.id)
      if (member) {
        for (const reward of roleRewards) {
          const role = message.guild?.roles.cache.get(reward.roleId)
          if (role && !member.roles.cache.has(role.id)) {
            await member.roles.add(role).catch(() => {})
          }
        }
      }
    }

    await saveUser(userData)
  },
}

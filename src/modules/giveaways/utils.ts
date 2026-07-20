import { Client, EmbedBuilder, TextChannel } from 'discord.js'
import { IGiveaway } from '../../database/models/Giveaway'
import Giveaway from '../../database/models/Giveaway'

export async function endGiveaway(gData: IGiveaway, client: Client) {
  const validEntries = gData.entries.filter(id => id !== client.user?.id)
  const winners: string[] = []
  const pool = [...validEntries]
  const count = Math.min(gData.winnerCount, pool.length)

  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * pool.length)
    winners.push(pool.splice(idx, 1)[0])
  }

  gData.ended = true
  gData.endedAt = new Date()
  gData.winners = winners
  await gData.save()

  const guild = client.guilds.cache.get(gData.guildId)
  if (!guild) return

  const channel = guild.channels.cache.get(gData.channelId)
  if (!channel?.isTextBased()) return

  const embed = new EmbedBuilder()
    .setColor(0x9B59B6)
    .setTitle('🎉 Giveaway Ended')
    .setDescription(`**Prize:** ${gData.prize}`)
    .setTimestamp()

  if (winners.length) {
    embed.addFields({ name: 'Winner(s)', value: winners.map(id => `<@${id}>`).join('\n') })
    await channel.send({ content: `🎉 Congratulations ${winners.map(id => `<@${id}>`).join(', ')}! You won **${gData.prize}**!`, embeds: [embed] })
  } else {
    embed.addFields({ name: 'Winner(s)', value: 'No valid entries.' })
    await channel.send({ embeds: [embed] })
  }

  const msg = await channel.messages.fetch(gData.messageId).catch(() => null)
  if (msg) {
    await msg.edit({ components: [] })
  }
}

export async function checkGiveaways(client: Client) {
  const giveaways = await Giveaway.find({ ended: false, endAt: { $lte: new Date() } })

  for (const g of giveaways) {
    await endGiveaway(g, client)
  }
}

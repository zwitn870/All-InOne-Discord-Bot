import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { getQueue, getCurrentSong } from '../structures/Player'
import { formatTime } from '../../../shared/utils/functions'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('View the music queue'),
  async execute(interaction: ChatInputCommandInteraction) {
    const queue = getQueue(interaction.guildId!)
    const current = getCurrentSong(interaction.guildId!)

    if (!queue.length && !current) {
      await interaction.reply({ content: 'The queue is empty.', ephemeral: true })
      return
    }

    const totalDuration = queue.reduce((acc, s) => acc + s.duration, 0)
    const embed = new EmbedBuilder()
      .setColor(0x1DB954)
      .setTitle('Music Queue')
      .setDescription(
        current
          ? `**Now Playing:** [${current.title}](${current.url}) \`[${formatTime(current.duration)}]\`\n\n`
          : ''
      )
      .setFooter({ text: `${queue.length} songs | ${formatTime(totalDuration)} total` })

    const chunks = queue.map((s, i) => `\`${i + 1}.\` [${s.title}](${s.url}) \`[${formatTime(s.duration)}]\` — <@${s.requestedBy}>`)

    const chunkSize = 10
    let page = 0

    const getPageEmbed = (p: number) => {
      const start = p * chunkSize
      const desc = embed.data.description + chunks.slice(start, start + chunkSize).join('\n')
      return EmbedBuilder.from(embed).setDescription(desc)
    }

    if (chunks.length <= chunkSize) {
      await interaction.reply({ embeds: [getPageEmbed(0)] })
      return
    }

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder().setCustomId('queue:prev').setLabel('◀').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('queue:next').setLabel('▶').setStyle(ButtonStyle.Secondary),
      )

    const msg = await interaction.reply({ embeds: [getPageEmbed(0)], components: [row], fetchReply: true })

    const collector = msg.createMessageComponentCollector({ time: 60000 })

    collector.on('collect', async (i) => {
      if (i.user.id !== interaction.user.id) {
        await i.reply({ content: 'Not your interaction.', ephemeral: true })
        return
      }

      if (i.customId === 'queue:next') page = Math.min(page + 1, Math.floor((chunks.length - 1) / chunkSize))
      else page = Math.max(page - 1, 0)

      await i.update({ embeds: [getPageEmbed(page)], components: [row] })
    })

    collector.on('end', async () => {
      await msg.edit({ components: [] }).catch(() => {})
    })
  },
}

export default command

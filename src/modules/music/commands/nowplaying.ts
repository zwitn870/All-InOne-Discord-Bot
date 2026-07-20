import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { getCurrentSong } from '../structures/Player'
import { formatTime } from '../../../shared/utils/functions'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Show the currently playing song'),
  async execute(interaction: ChatInputCommandInteraction) {
    const song = getCurrentSong(interaction.guildId!)

    if (!song) {
      await interaction.reply({ content: 'Nothing is playing right now.', ephemeral: true })
      return
    }

    const embed = new EmbedBuilder()
      .setColor(0x1DB954)
      .setTitle(song.title)
      .setURL(song.url)
      .setDescription(`Duration: \`${formatTime(song.duration)}\`\nRequested by: <@${song.requestedBy}>`)
      .setThumbnail(song.thumbnail ?? null)
      .setFooter({ text: song.author ?? '' })

    await interaction.reply({ embeds: [embed] })
  },
}

export default command

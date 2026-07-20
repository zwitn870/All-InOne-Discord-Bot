import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { skip, getCurrentSong } from '../structures/Player'
import { music, warning } from '../../../shared/utils/embed'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current song'),
  async execute(interaction: ChatInputCommandInteraction) {
    const current = getCurrentSong(interaction.guildId!)

    if (!current) {
      await interaction.reply({ embeds: [warning('Nothing to skip', 'No song is currently playing.')] })
      return
    }

    skip(interaction.guildId!)
    await interaction.reply({ embeds: [music('Skipped', `Skipped [${current.title}](${current.url})`)] })
  },
}

export default command

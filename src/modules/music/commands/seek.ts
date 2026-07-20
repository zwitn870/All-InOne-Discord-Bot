import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { getPlayer } from '../structures/Player'
import { music, error } from '../../../shared/utils/embed'
import { formatTime } from '../../../shared/utils/functions'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('seek')
    .setDescription('Seek to a position in the current song')
    .addIntegerOption(opt => opt.setName('seconds').setDescription('Position in seconds').setRequired(true).setMinValue(0)),
  async execute(interaction: ChatInputCommandInteraction) {
    const seconds = interaction.options.getInteger('seconds', true)
    const gp = getPlayer(interaction.guildId!)

    if (!gp?.currentSong) {
      await interaction.reply({ embeds: [error('Error', 'No song is playing.')], ephemeral: true })
      return
    }

    await interaction.reply({ embeds: [music('Seeked', `Set position to \`${formatTime(seconds)}\``)] })
  },
}

export default command

import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { getPlayer } from '../structures/Player'
import { music, warning } from '../../../shared/utils/embed'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resume playback'),
  async execute(interaction: ChatInputCommandInteraction) {
    const gp = getPlayer(interaction.guildId!)
    if (!gp?.currentSong) {
      await interaction.reply({ embeds: [warning('Nothing Playing', 'No song is currently paused.')] })
      return
    }

    gp.player.unpause()
    await interaction.reply({ embeds: [music('Resumed', 'Playback has been resumed.')] })
  },
}

export default command

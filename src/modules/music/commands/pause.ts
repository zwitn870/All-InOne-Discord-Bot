import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { getPlayer } from '../structures/Player'
import { music, warning } from '../../../shared/utils/embed'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause the current song'),
  async execute(interaction: ChatInputCommandInteraction) {
    const gp = getPlayer(interaction.guildId!)
    if (!gp?.currentSong) {
      await interaction.reply({ embeds: [warning('Nothing Playing', 'No song is currently playing.')] })
      return
    }

    gp.player.pause()
    await interaction.reply({ embeds: [music('Paused', 'Playback has been paused.')] })
  },
}

export default command

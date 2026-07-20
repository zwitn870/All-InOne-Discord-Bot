import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { stop } from '../structures/Player'
import { music } from '../../../shared/utils/embed'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop playback and clear the queue'),
  async execute(interaction: ChatInputCommandInteraction) {
    stop(interaction.guildId!)
    await interaction.reply({ embeds: [music('Stopped', 'Playback stopped and queue cleared.')] })
  },
}

export default command

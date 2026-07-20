import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { removeSong, getQueue } from '../structures/Player'
import { music, error } from '../../../shared/utils/embed'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove a song from the queue')
    .addIntegerOption(opt => opt.setName('index').setDescription('Song number to remove').setRequired(true).setMinValue(1)),
  async execute(interaction: ChatInputCommandInteraction) {
    const index = interaction.options.getInteger('index', true) - 1
    const removed = removeSong(interaction.guildId!, index)

    if (!removed) {
      await interaction.reply({ embeds: [error('Error', 'Invalid song index.')], ephemeral: true })
      return
    }

    await interaction.reply({ embeds: [music('Removed', `Removed [${removed.title}](${removed.url}) from the queue.`)] })
  },
}

export default command

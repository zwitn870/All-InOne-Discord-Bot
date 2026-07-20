import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { shuffleQueue, getQueue } from '../structures/Player'
import { music, warning } from '../../../shared/utils/embed'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffle the queue'),
  async execute(interaction: ChatInputCommandInteraction) {
    const queue = getQueue(interaction.guildId!)
    if (queue.length < 2) {
      await interaction.reply({ embeds: [warning('Cannot Shuffle', 'Need at least 2 songs in the queue.')] })
      return
    }

    shuffleQueue(interaction.guildId!)
    await interaction.reply({ embeds: [music('Shuffled', `Shuffled **${queue.length}** songs.`)] })
  },
}

export default command

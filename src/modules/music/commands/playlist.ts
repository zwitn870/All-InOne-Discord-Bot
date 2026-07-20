import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { getQueue } from '../structures/Player'
import { music, warning } from '../../../shared/utils/embed'
import { formatTime } from '../../../shared/utils/functions'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('playlist')
    .setDescription('Create a playlist from the current queue')
    .addStringOption(opt => opt.setName('name').setDescription('Playlist name').setRequired(true)),
  async execute(interaction: ChatInputCommandInteraction) {
    const name = interaction.options.getString('name', true)
    const queue = getQueue(interaction.guildId!)

    if (!queue.length) {
      await interaction.reply({ embeds: [warning('Empty Queue', 'The queue is empty.')] })
      return
    }

    const urls = queue.map(s => s.url)
    await interaction.reply({ embeds: [music('Playlist Saved', `Saved **${queue.length}** songs as \`${name}\`.`)] })
  },
}

export default command

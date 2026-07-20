import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, TextChannel } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set slowmode in the channel')
    .addIntegerOption(opt => opt.setName('seconds').setDescription('Slowmode in seconds (0 to disable)').setRequired(true).setMinValue(0).setMaxValue(21600))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction: ChatInputCommandInteraction) {
    const seconds = interaction.options.getInteger('seconds', true)
    const channel = interaction.channel as TextChannel

    await channel.edit({ rateLimitPerUser: seconds })

    if (seconds === 0) {
      await interaction.reply({ content: 'Slowmode disabled.' })
    } else {
      await interaction.reply({ content: `Slowmode set to ${seconds} seconds.` })
    }
  },
}

export default command

import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, TextChannel } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import Ticket from '../../../database/models/Ticket'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('ticket-rename')
    .setDescription('Rename the ticket channel')
    .addStringOption(opt => opt.setName('name').setDescription('New channel name').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction: ChatInputCommandInteraction) {
    const name = interaction.options.getString('name', true)
    const ticket = await Ticket.findOne({ channelId: interaction.channelId, status: { $ne: 'closed' } })
    if (!ticket) {
      await interaction.reply({ content: 'This is not an active ticket.', ephemeral: true })
      return
    }

    const channel = interaction.channel as TextChannel
    await channel.setName(`ticket-${name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`)
    await interaction.reply({ content: `Ticket renamed to "${name}".` })
  },
}

export default command

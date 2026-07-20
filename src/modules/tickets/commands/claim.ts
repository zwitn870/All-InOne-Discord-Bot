import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import Ticket from '../../../database/models/Ticket'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('ticket-claim')
    .setDescription('Claim this ticket')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction: ChatInputCommandInteraction) {
    const ticket = await Ticket.findOne({ channelId: interaction.channelId, status: 'open' })
    if (!ticket) {
      await interaction.reply({ content: 'This ticket cannot be claimed.', ephemeral: true })
      return
    }

    ticket.claimedById = interaction.user.id
    ticket.status = 'claimed'
    await ticket.save()

    await interaction.reply({ content: `Ticket has been claimed by ${interaction.user}.` })
  },
}

export default command

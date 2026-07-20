import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, TextChannel } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import Ticket from '../../../database/models/Ticket'
import { getGuild } from '../../../shared/services/guildService'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('ticket-close')
    .setDescription('Close the current ticket')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction: ChatInputCommandInteraction) {
    const ticket = await Ticket.findOne({ channelId: interaction.channelId, status: { $ne: 'closed' } })
    if (!ticket) {
      await interaction.reply({ content: 'This is not a ticket channel.', ephemeral: true })
      return
    }

    ticket.status = 'closed'
    ticket.closedAt = new Date()
    await ticket.save()

    const channel = interaction.channel as TextChannel

    await channel.edit({ permissionOverwrites: [] })
    await interaction.reply({ content: 'Ticket closed. This channel will be deleted soon.' })

    setTimeout(async () => {
      try {
        if (channel.deletable) {
          await channel.delete()
        }
      } catch {
        // Channel already deleted
      }
    }, 10000)
  },
}

export default command

import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, TextChannel } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import Ticket from '../../../database/models/Ticket'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('ticket-add')
    .setDescription('Add a user to the ticket')
    .addUserOption(opt => opt.setName('user').setDescription('User to add').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user', true)
    const ticket = await Ticket.findOne({ channelId: interaction.channelId, status: { $ne: 'closed' } })
    if (!ticket) {
      await interaction.reply({ content: 'This is not an active ticket.', ephemeral: true })
      return
    }

    if (ticket.members.includes(user.id)) {
      await interaction.reply({ content: 'User is already in this ticket.', ephemeral: true })
      return
    }

    ticket.members.push(user.id)
    await ticket.save()

    const channel = interaction.channel as TextChannel
    await channel.edit({
      permissionOverwrites: [
        ...channel.permissionOverwrites.cache.map(p => p),
        { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
      ],
    })

    await interaction.reply({ content: `Added ${user} to the ticket.` })
  },
}

export default command

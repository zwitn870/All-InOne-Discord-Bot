import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, TextChannel } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import Ticket from '../../../database/models/Ticket'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('ticket-remove')
    .setDescription('Remove a user from the ticket')
    .addUserOption(opt => opt.setName('user').setDescription('User to remove').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user', true)
    const ticket = await Ticket.findOne({ channelId: interaction.channelId, status: { $ne: 'closed' } })
    if (!ticket) {
      await interaction.reply({ content: 'This is not an active ticket.', ephemeral: true })
      return
    }

    if (!ticket.members.includes(user.id)) {
      await interaction.reply({ content: 'User is not in this ticket.', ephemeral: true })
      return
    }

    ticket.members = ticket.members.filter(id => id !== user.id)
    await ticket.save()

    const channel = interaction.channel as TextChannel
    await channel.edit({
      permissionOverwrites: [
        ...channel.permissionOverwrites.cache.map(p => p),
        { id: user.id, deny: [PermissionFlagsBits.ViewChannel] },
      ],
    })

    await interaction.reply({ content: `Removed ${user} from the ticket.` })
  },
}

export default command

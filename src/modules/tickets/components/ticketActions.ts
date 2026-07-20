import { ButtonInteraction, StringSelectMenuInteraction, ModalSubmitInteraction, PermissionFlagsBits, TextChannel } from 'discord.js'
import { ComponentDefinition } from '../../../shared/types'
import Ticket from '../../../database/models/Ticket'

const closeComponent: ComponentDefinition = {
  customId: 'ticket:close',
  type: 'button',
  async execute(interaction: ButtonInteraction | StringSelectMenuInteraction | ModalSubmitInteraction) {
    const bi = interaction as ButtonInteraction
    const member = bi.member as { permissions: { has: (perm: bigint) => boolean }; roles: { cache: { has: (id: string) => boolean } } }
    const guild = bi.guild!

    const ticket = await Ticket.findOne({ channelId: bi.channelId, status: { $ne: 'closed' } })
    if (!ticket) {
      await bi.reply({ content: 'This ticket is already closed.', ephemeral: true })
      return
    }

    if (ticket.authorId !== bi.user.id && !member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      await bi.reply({ content: 'You cannot close this ticket.', ephemeral: true })
      return
    }

    ticket.status = 'closed'
    ticket.closedAt = new Date()
    await ticket.save()

    await bi.reply({ content: 'Closing ticket...' })

    setTimeout(async () => {
      try {
        const channel = bi.channel as TextChannel
        if (channel.deletable) {
          await channel.delete()
        }
      } catch {
        // ignore
      }
    }, 10000)
  },
}

const claimComponent: ComponentDefinition = {
  customId: 'ticket:claim',
  type: 'button',
  async execute(interaction: ButtonInteraction | StringSelectMenuInteraction | ModalSubmitInteraction) {
    const bi = interaction as ButtonInteraction
    const ticket = await Ticket.findOne({ channelId: bi.channelId, status: 'open' })
    if (!ticket) {
      await bi.reply({ content: 'This ticket cannot be claimed.', ephemeral: true })
      return
    }

    ticket.claimedById = bi.user.id
    ticket.status = 'claimed'
    await ticket.save()

    await bi.reply({ content: `Ticket claimed by ${bi.user}.` })
  },
}

export { closeComponent, claimComponent }

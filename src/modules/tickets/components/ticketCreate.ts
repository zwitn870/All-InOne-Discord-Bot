import { ButtonInteraction, ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js'
import { ComponentHandler } from '../../../shared/types'
import { getGuild, invalidateCache } from '../../../shared/services/guildService'
import Ticket from '../../../database/models/Ticket'
import { ticket } from '../../../shared/utils/embed'

const handler: ComponentHandler = async (interaction) => {
  const btnInteraction = interaction as ButtonInteraction
  const guild = await getGuild(btnInteraction.guildId!)

  if (!guild.tickets.categoryId || !guild.tickets.supportRoleIds.length) {
    await btnInteraction.reply({ content: 'Ticket system is not configured.', ephemeral: true })
    return
  }

  const existing = await Ticket.findOne({ guildId: btnInteraction.guildId!, authorId: btnInteraction.user.id, status: { $ne: 'closed' } })
  if (existing) {
    await btnInteraction.reply({ content: 'You already have an open ticket.', ephemeral: true })
    return
  }

  guild.tickets.ticketCounter += 1
  await guild.save()
  invalidateCache(btnInteraction.guildId!)

  const ticketNumber = guild.tickets.ticketCounter
  const channelName = `ticket-${ticketNumber}`

  const category = btnInteraction.guild!.channels.cache.get(guild.tickets.categoryId)
  const supportOverwrites = guild.tickets.supportRoleIds.map(roleId => ({
    id: roleId,
    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels],
    deny: [PermissionFlagsBits.CreateInstantInvite],
  }))

  const channel = await btnInteraction.guild!.channels.create({
    name: channelName,
    type: ChannelType.GuildText,
    parent: category?.id,
    permissionOverwrites: [
      { id: btnInteraction.guildId!, deny: [PermissionFlagsBits.ViewChannel] },
      { id: btnInteraction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
      ...supportOverwrites,
    ],
  })

  await new Ticket({
    guildId: btnInteraction.guildId!,
    channelId: channel.id,
    authorId: btnInteraction.user.id,
    ticketNumber,
    subject: 'Support Ticket',
  }).save()

  const embed = ticket('Support Ticket', `Welcome ${btnInteraction.user}! Support team will be with you shortly.\n\n**Ticket #${ticketNumber}**`)

  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder().setCustomId('ticket:close').setLabel('Close').setStyle(ButtonStyle.Danger).setEmoji('🔒'),
      new ButtonBuilder().setCustomId('ticket:claim').setLabel('Claim').setStyle(ButtonStyle.Secondary).setEmoji('🙋'),
    )

  await channel.send({ content: `${guild.tickets.supportRoleIds.map(id => `<@&${id}>`).join(' ')}`, embeds: [embed], components: [row] })
  await btnInteraction.reply({ content: `Ticket created: ${channel}`, ephemeral: true })
}

export default {
  customId: 'ticket:create',
  type: 'button' as const,
  execute: handler,
}

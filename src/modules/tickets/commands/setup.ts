import { SlashCommandBuilder, ChatInputCommandInteraction, ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { requiresAdmin } from '../../../shared/utils/permissions'
import { getGuild, invalidateCache } from '../../../shared/services/guildService'
import { ticket } from '../../../shared/utils/embed'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('ticket-setup')
    .setDescription('Set up the ticket system')
    .addChannelOption(opt => opt.setName('category').setDescription('Category for ticket channels').setRequired(true).addChannelTypes(ChannelType.GuildCategory))
    .addChannelOption(opt => opt.setName('channel').setDescription('Channel to send ticket panel').setRequired(true).addChannelTypes(ChannelType.GuildText))
    .addRoleOption(opt => opt.setName('support-role').setDescription('Support role').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction: ChatInputCommandInteraction) {
    if (!requiresAdmin(interaction)) {
      await interaction.reply({ content: 'You need Administrator permission.', ephemeral: true })
      return
    }

    const category = interaction.options.getChannel('category', true)
    const channel = interaction.options.getChannel('channel', true)
    const role = interaction.options.getRole('support-role', true)

    const guild = await getGuild(interaction.guildId!)
    guild.tickets.categoryId = category.id
    guild.tickets.channelId = channel.id
    guild.tickets.supportRoleIds = [role.id]
    await guild.save()
    invalidateCache(interaction.guildId!)

    const embed = ticket('Ticket System', 'Click the button below to create a support ticket.')
      .setDescription('Need help? Create a ticket and our support team will assist you.')

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('ticket:create')
          .setLabel('Create Ticket')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('🎫')
      )

    const msg = await (channel as { send: (opts: unknown) => Promise<{ id: string }> }).send({ embeds: [embed], components: [row] })
    guild.tickets.messageId = msg.id
    await guild.save()

    await interaction.reply({ content: 'Ticket system has been set up.', ephemeral: true })
  },
}

export default command

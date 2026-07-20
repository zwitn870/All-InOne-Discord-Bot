import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import Giveaway from '../../../database/models/Giveaway'
import { giveaway, error } from '../../../shared/utils/embed'
import { formatTime } from '../../../shared/utils/functions'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('giveaway-start')
    .setDescription('Start a giveaway')
    .addStringOption(opt => opt.setName('prize').setDescription('Prize to give away').setRequired(true))
    .addIntegerOption(opt => opt.setName('winners').setDescription('Number of winners').setRequired(true).setMinValue(1).setMaxValue(50))
    .addIntegerOption(opt => opt.setName('duration').setDescription('Duration in minutes').setRequired(true).setMinValue(1).setMaxValue(43200))
    .addChannelOption(opt => opt.setName('channel').setDescription('Channel to post in'))
    .addRoleOption(opt => opt.setName('required-role').setDescription('Required role to enter'))
    .addIntegerOption(opt => opt.setName('required-level').setDescription('Required level to enter').setMinValue(1))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction: ChatInputCommandInteraction) {
    const prize = interaction.options.getString('prize', true)
    const winnerCount = interaction.options.getInteger('winners', true)
    const durationMinutes = interaction.options.getInteger('duration', true)
    const channel = (interaction.options.getChannel('channel') ?? interaction.channel) as TextChannel
    const requiredRole = interaction.options.getRole('required-role')
    const requiredLevel = interaction.options.getInteger('required-level')

    if (!channel?.isTextBased()) {
      await interaction.reply({ embeds: [error('Error', 'Invalid channel.')], ephemeral: true })
      return
    }

    const endAt = new Date(Date.now() + durationMinutes * 60000)

    const requirements: { type: 'role' | 'level'; value: string | number }[] = []
    if (requiredRole) requirements.push({ type: 'role', value: requiredRole.id })
    if (requiredLevel) requirements.push({ type: 'level', value: requiredLevel })

    const embed = giveaway('🎉 Giveaway', `**${prize}**`)
      .setDescription(
        `**Winner(s):** ${winnerCount}\n` +
        `**Ends:** <t:${Math.floor(endAt.getTime() / 1000)}:R>\n` +
        (requirements.length ? `**Requirements:** ${requirements.map(r => r.type === 'role' ? `<@&${r.value}>` : `Level ${r.value}`).join(', ')}\n` : '') +
        `\nClick the button to enter!`
      )
      .setFooter({ text: `${winnerCount} winner(s)` })

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder().setCustomId('giveaway:enter').setLabel('🎉 Enter').setStyle(ButtonStyle.Success)
      )

    const msg = await channel.send({ embeds: [embed], components: [row] })

    await new Giveaway({
      guildId: interaction.guildId!,
      channelId: channel.id,
      messageId: msg.id,
      prize,
      winnerCount,
      endAt,
      requirements,
      entries: [],
      ended: false,
      hostedBy: interaction.user.id,
    }).save()

    await interaction.reply({ content: `Giveaway started in ${channel}!`, ephemeral: true })
  },
}

export default command

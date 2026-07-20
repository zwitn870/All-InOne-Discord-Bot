import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server')
    .addUserOption(opt => opt.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for the ban'))
    .addIntegerOption(opt => opt.setName('days').setDescription('Days of messages to delete').setMinValue(0).setMaxValue(7))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user', true)
    const reason = interaction.options.getString('reason') ?? 'No reason provided'
    const days = interaction.options.getInteger('days') ?? 0

    const member = interaction.guild?.members.cache.get(user.id)
    if (member && !member.bannable) {
      await interaction.reply({ content: 'I cannot ban that user.', ephemeral: true })
      return
    }

    await interaction.guild?.members.ban(user, { reason, deleteMessageSeconds: days * 86400 })
    await interaction.reply({ content: `Banned ${user.tag} | ${reason}` })
  },
}

export default command

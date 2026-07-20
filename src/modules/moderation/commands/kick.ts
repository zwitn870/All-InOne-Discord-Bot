import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .addUserOption(opt => opt.setName('user').setDescription('User to kick').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for the kick'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user', true)
    const reason = interaction.options.getString('reason') ?? 'No reason provided'

    const member = interaction.guild?.members.cache.get(user.id)
    if (!member?.kickable) {
      await interaction.reply({ content: 'I cannot kick that user.', ephemeral: true })
      return
    }

    await member.kick(reason)
    await interaction.reply({ content: `Kicked ${user.tag} | ${reason}` })
  },
}

export default command

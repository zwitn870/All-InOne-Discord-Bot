import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { getUser, saveUser } from '../../../shared/services/userService'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member')
    .addUserOption(opt => opt.setName('user').setDescription('User to warn').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for the warning').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user', true)
    const reason = interaction.options.getString('reason', true)

    const userData = await getUser(user.id, interaction.guildId!)
    userData.warnings.push({ moderatorId: interaction.user.id, reason, date: new Date() })
    await saveUser(userData)

    await interaction.reply({ content: `Warned ${user.tag} | ${reason} (${userData.warnings.length} total warnings)` })
  },
}

export default command

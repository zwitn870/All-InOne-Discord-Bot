import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { getUser } from '../../../shared/services/userService'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Check warnings for a user')
    .addUserOption(opt => opt.setName('user').setDescription('User to check').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user', true)
    const userData = await getUser(user.id, interaction.guildId!)

    if (!userData.warnings.length) {
      await interaction.reply({ content: `${user.tag} has no warnings.`, ephemeral: true })
      return
    }

    const embed = new EmbedBuilder()
      .setColor(0xED4245)
      .setTitle(`Warnings for ${user.tag}`)
      .setDescription(userData.warnings.map((w, i) =>
        `**#${i + 1}** - ${w.date.toLocaleDateString()}\nReason: ${w.reason}\nMod: <@${w.moderatorId}>`
      ).join('\n\n'))
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  },
}

export default command

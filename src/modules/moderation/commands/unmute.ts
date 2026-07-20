import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Remove a timeout from a member')
    .addUserOption(opt => opt.setName('user').setDescription('User to unmute').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user', true)
    const member = interaction.guild?.members.cache.get(user.id)

    if (!member?.moderatable) {
      await interaction.reply({ content: 'I cannot unmute that user.', ephemeral: true })
      return
    }

    await member.timeout(null)
    await interaction.reply({ content: `Unmuted ${user.tag}` })
  },
}

export default command

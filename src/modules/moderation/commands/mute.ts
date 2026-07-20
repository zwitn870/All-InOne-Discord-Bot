import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { getGuild } from '../../../shared/services/guildService'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Timeout a member')
    .addUserOption(opt => opt.setName('user').setDescription('User to mute').setRequired(true))
    .addIntegerOption(opt => opt.setName('duration').setDescription('Duration in minutes').setRequired(true).setMinValue(1).setMaxValue(40320))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for the mute'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user', true)
    const duration = interaction.options.getInteger('duration', true)
    const reason = interaction.options.getString('reason') ?? 'No reason provided'

    const member = interaction.guild?.members.cache.get(user.id)
    if (!member?.moderatable) {
      await interaction.reply({ content: 'I cannot mute that user.', ephemeral: true })
      return
    }

    await member.timeout(duration * 60 * 1000, reason)
    await interaction.reply({ content: `Muted ${user.tag} for ${duration} minutes | ${reason}` })
  },
}

export default command

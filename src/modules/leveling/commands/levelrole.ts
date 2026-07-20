import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { getGuild, invalidateCache } from '../../../shared/services/guildService'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('level-role')
    .setDescription('Add or remove level reward roles')
    .addSubcommand(sub =>
      sub.setName('add')
        .setDescription('Add a level role reward')
        .addRoleOption(opt => opt.setName('role').setDescription('Role to reward').setRequired(true))
        .addIntegerOption(opt => opt.setName('level').setDescription('Required level').setRequired(true).setMinValue(1))
    )
    .addSubcommand(sub =>
      sub.setName('remove')
        .setDescription('Remove a level role reward')
        .addRoleOption(opt => opt.setName('role').setDescription('Role to remove').setRequired(true))
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction: ChatInputCommandInteraction) {
    const guild = await getGuild(interaction.guildId!)

    if (interaction.options.getSubcommand() === 'add') {
      const role = interaction.options.getRole('role', true)
      const level = interaction.options.getInteger('level', true)

      const existing = guild.leveling.levelRoles.find(r => r.roleId === role.id)
      if (existing) {
        existing.level = level
      } else {
        guild.leveling.levelRoles.push({ level, roleId: role.id })
      }
      await guild.save()
      invalidateCache(interaction.guildId!)
      await interaction.reply({ content: `Added ${role.name} as level ${level} reward.` })
    } else {
      const role = interaction.options.getRole('role', true)
      guild.leveling.levelRoles = guild.leveling.levelRoles.filter(r => r.roleId !== role.id)
      await guild.save()
      invalidateCache(interaction.guildId!)
      await interaction.reply({ content: `Removed ${role.name} from level rewards.` })
    }
  },
}

export default command

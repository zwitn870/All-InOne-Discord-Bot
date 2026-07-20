import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { getUser, saveUser } from '../../../shared/services/userService'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('setlevel')
    .setDescription('Set a user\'s level')
    .addUserOption(opt => opt.setName('user').setDescription('User to modify').setRequired(true))
    .addIntegerOption(opt => opt.setName('level').setDescription('New level').setRequired(true).setMinValue(0))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getUser('user', true)
    const level = interaction.options.getInteger('level', true)

    const userData = await getUser(target.id, interaction.guildId!)
    userData.level = level
    userData.xp = level * 100
    await saveUser(userData)

    await interaction.reply({ content: `Set ${target.tag}'s level to ${level}.` })
  },
}

export default command

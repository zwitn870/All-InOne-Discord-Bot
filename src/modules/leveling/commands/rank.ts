import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { getUser } from '../../../shared/services/userService'
import { getGuild } from '../../../shared/services/guildService'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Check your or another user\'s rank')
    .addUserOption(opt => opt.setName('user').setDescription('User to check')),
  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getUser('user') ?? interaction.user
    const userData = await getUser(target.id, interaction.guildId!)
    const guild = await getGuild(interaction.guildId!)

    const xpForNext = (userData.level + 1) * 100
    const progress = Math.min((userData.xp / xpForNext) * 100, 100)

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setAuthor({ name: target.username, iconURL: target.displayAvatarURL() })
      .setTitle('Rank Card')
      .addFields(
        { name: 'Level', value: `${userData.level}`, inline: true },
        { name: 'XP', value: `${userData.xp} / ${xpForNext}`, inline: true },
        { name: 'Progress', value: `${progress.toFixed(1)}%`, inline: true },
      )
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  },
}

export default command

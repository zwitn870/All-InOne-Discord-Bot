import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { getLeaderboard } from '../../../shared/services/userService'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Show the XP leaderboard'),
  async execute(interaction: ChatInputCommandInteraction) {
    const topUsers = await getLeaderboard(interaction.guildId!, 'xp', 10)

    if (!topUsers.length) {
      await interaction.reply({ content: 'No data yet.', ephemeral: true })
      return
    }

    const members = await interaction.guild!.members.fetch()
    const lines = topUsers.map((u, i) => {
      const member = members.get(u.userId)
      return `**${i + 1}.** ${member?.user.username ?? 'Unknown'} — Level **${u.level}** (${u.xp} XP)`
    })

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('Leaderboard')
      .setDescription(lines.join('\n'))
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  },
}

export default command

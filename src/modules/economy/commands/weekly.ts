import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { getUser, saveUser } from '../../../shared/services/userService'
import { getGuild } from '../../../shared/services/guildService'
import { economy, error } from '../../../shared/utils/embed'
import { formatNumber } from '../../../shared/utils/functions'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('weekly')
    .setDescription('Claim your weekly reward'),
  async execute(interaction: ChatInputCommandInteraction) {
    const userData = await getUser(interaction.user.id, interaction.guildId!)
    const guild = await getGuild(interaction.guildId!)

    const now = new Date()
    const lastWeekly = userData.lastWeekly
    if (lastWeekly) {
      const diff = now.getTime() - lastWeekly.getTime()
      if (diff < 604800000) {
        const remaining = 604800000 - diff
        const days = Math.floor(remaining / 86400000)
        await interaction.reply({ embeds: [error('Already Claimed', `Come back in ${days} day(s).`)], ephemeral: true })
        return
      }
    }

    const amount = guild.economy.dailyAmount * 5
    userData.wallet += amount
    userData.lastWeekly = now
    await saveUser(userData)

    await interaction.reply({ embeds: [economy('Weekly Reward', `You received **${formatNumber(amount)}** ${guild.economy.currencyIcon}!`)] })
  },
}

export default command

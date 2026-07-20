import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { getUser, saveUser } from '../../../shared/services/userService'
import { getGuild } from '../../../shared/services/guildService'
import { economy, error } from '../../../shared/utils/embed'
import { formatNumber } from '../../../shared/utils/functions'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily reward'),
  async execute(interaction: ChatInputCommandInteraction) {
    const userData = await getUser(interaction.user.id, interaction.guildId!)
    const guild = await getGuild(interaction.guildId!)

    const now = new Date()
    const lastDaily = userData.lastDaily
    if (lastDaily) {
      const diff = now.getTime() - lastDaily.getTime()
      if (diff < 86400000) {
        const remaining = 86400000 - diff
        const hours = Math.floor(remaining / 3600000)
        const minutes = Math.floor((remaining % 3600000) / 60000)
        await interaction.reply({ embeds: [error('Already Claimed', `Come back in ${hours}h ${minutes}m.`)], ephemeral: true })
        return
      }
    }

    userData.wallet += guild.economy.dailyAmount
    userData.lastDaily = now
    await saveUser(userData)

    await interaction.reply({ embeds: [economy('Daily Reward', `You received **${formatNumber(guild.economy.dailyAmount)}** ${guild.economy.currencyIcon}!`)] })
  },
}

export default command

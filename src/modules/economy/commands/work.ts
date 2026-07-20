import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { getUser, saveUser } from '../../../shared/services/userService'
import { getGuild } from '../../../shared/services/guildService'
import { economy, error } from '../../../shared/utils/embed'
import { randomRange, formatNumber } from '../../../shared/utils/functions'

const jobs = ['developer', 'designer', 'writer', 'chef', 'pilot', 'doctor', 'teacher', 'farmer']

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Work to earn currency'),
  async execute(interaction: ChatInputCommandInteraction) {
    const userData = await getUser(interaction.user.id, interaction.guildId!)
    const guild = await getGuild(interaction.guildId!)

    const now = new Date()
    const lastWork = userData.lastWork
    if (lastWork) {
      const diff = now.getTime() - lastWork.getTime()
      if (diff < 3600000) {
        const remaining = 3600000 - diff
        const minutes = Math.ceil(remaining / 60000)
        await interaction.reply({ embeds: [error('On Cooldown', `You can work again in ${minutes} minute(s).`)], ephemeral: true })
        return
      }
    }

    const earned = randomRange(guild.economy.workMin, guild.economy.workMax)
    const job = jobs[Math.floor(Math.random() * jobs.length)]

    userData.wallet += earned
    userData.lastWork = now
    await saveUser(userData)

    await interaction.reply({ embeds: [economy('Work Complete', `You worked as a **${job}** and earned **${formatNumber(earned)}** ${guild.economy.currencyIcon}!`)] })
  },
}

export default command

import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { getUser, saveUser } from '../../../shared/services/userService'
import { getGuild } from '../../../shared/services/guildService'
import { economy, error } from '../../../shared/utils/embed'
import { randomRange, formatNumber } from '../../../shared/utils/functions'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('gamble')
    .setDescription('Gamble your currency (50% chance to double)')
    .addIntegerOption(opt => opt.setName('amount').setDescription('Amount to gamble').setRequired(true).setMinValue(1)),
  async execute(interaction: ChatInputCommandInteraction) {
    const amount = interaction.options.getInteger('amount', true)
    const userData = await getUser(interaction.user.id, interaction.guildId!)
    const guild = await getGuild(interaction.guildId!)

    if (userData.wallet < amount) {
      await interaction.reply({ embeds: [error('Insufficient Funds', `You only have ${formatNumber(userData.wallet)} ${guild.economy.currencyIcon}.`)], ephemeral: true })
      return
    }

    const win = Math.random() < 0.5

    if (win) {
      userData.wallet += amount
      await saveUser(userData)
      await interaction.reply({ embeds: [economy('You Won!', `You gambled **${formatNumber(amount)}** ${guild.economy.currencyIcon} and won **${formatNumber(amount * 2)}**!`)] })
    } else {
      userData.wallet -= amount
      await saveUser(userData)
      await interaction.reply({ embeds: [error('You Lost', `You gambled **${formatNumber(amount)}** ${guild.economy.currencyIcon} and lost it all.`)] })
    }
  },
}

export default command

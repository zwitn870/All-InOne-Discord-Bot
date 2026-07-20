import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { getUser, saveUser } from '../../../shared/services/userService'
import { getGuild } from '../../../shared/services/guildService'
import { economy, error } from '../../../shared/utils/embed'
import { formatNumber, randomRange } from '../../../shared/utils/functions'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Bet on a dice roll (1-6)')
    .addIntegerOption(opt => opt.setName('number').setDescription('Number to bet on (1-6)').setRequired(true).setMinValue(1).setMaxValue(6))
    .addIntegerOption(opt => opt.setName('amount').setDescription('Amount to bet').setRequired(true).setMinValue(1)),
  async execute(interaction: ChatInputCommandInteraction) {
    const guess = interaction.options.getInteger('number', true)
    const amount = interaction.options.getInteger('amount', true)
    const userData = await getUser(interaction.user.id, interaction.guildId!)
    const guild = await getGuild(interaction.guildId!)

    if (userData.wallet < amount) {
      await interaction.reply({ embeds: [error('Insufficient Funds', `You only have ${formatNumber(userData.wallet)} ${guild.economy.currencyIcon}.`)], ephemeral: true })
      return
    }

    const roll = randomRange(1, 6)
    const won = roll === guess

    if (won) {
      const payout = amount * 4
      userData.wallet += payout
      await saveUser(userData)
      await interaction.reply({ embeds: [economy('Dice', `🎲 The dice landed on **${roll}**! You won **${formatNumber(payout)}** ${guild.economy.currencyIcon}!`)] })
    } else {
      userData.wallet -= amount
      await saveUser(userData)
      await interaction.reply({ embeds: [error('Dice', `🎲 The dice landed on **${roll}**. You lost **${formatNumber(amount)}**.`)] })
    }
  },
}

export default command

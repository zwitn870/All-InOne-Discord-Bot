import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { getUser, saveUser } from '../../../shared/services/userService'
import { getGuild } from '../../../shared/services/guildService'
import { economy, error } from '../../../shared/utils/embed'
import { formatNumber, randomRange } from '../../../shared/utils/functions'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flip a coin and bet on the outcome')
    .addStringOption(opt =>
      opt.setName('call')
        .setDescription('Heads or Tails')
        .setRequired(true)
        .addChoices(
          { name: 'Heads', value: 'heads' },
          { name: 'Tails', value: 'tails' },
        )
    )
    .addIntegerOption(opt => opt.setName('amount').setDescription('Amount to bet').setRequired(true).setMinValue(1)),
  async execute(interaction: ChatInputCommandInteraction) {
    const call = interaction.options.getString('call', true)
    const amount = interaction.options.getInteger('amount', true)
    const userData = await getUser(interaction.user.id, interaction.guildId!)
    const guild = await getGuild(interaction.guildId!)

    if (userData.wallet < amount) {
      await interaction.reply({ embeds: [error('Insufficient Funds', `You only have ${formatNumber(userData.wallet)} ${guild.economy.currencyIcon}.`)], ephemeral: true })
      return
    }

    const result = Math.random() < 0.5 ? 'heads' : 'tails'
    const won = call === result

    if (won) {
      userData.wallet += amount
      await saveUser(userData)
      await interaction.reply({ embeds: [economy('Coinflip', `It landed on **${result}**! You won **${formatNumber(amount)}** ${guild.economy.currencyIcon}!`)] })
    } else {
      userData.wallet -= amount
      await saveUser(userData)
      await interaction.reply({ embeds: [error('Coinflip', `It landed on **${result}**! You lost **${formatNumber(amount)}** ${guild.economy.currencyIcon}.`)] })
    }
  },
}

export default command

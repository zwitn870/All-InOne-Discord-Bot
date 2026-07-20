import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { getUser, saveUser } from '../../../shared/services/userService'
import { economy, error } from '../../../shared/utils/embed'
import { formatNumber } from '../../../shared/utils/functions'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('give')
    .setDescription('Give currency to another user')
    .addUserOption(opt => opt.setName('user').setDescription('Recipient').setRequired(true))
    .addIntegerOption(opt => opt.setName('amount').setDescription('Amount to give').setRequired(true).setMinValue(1)),
  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getUser('user', true)
    const amount = interaction.options.getInteger('amount', true)

    if (target.id === interaction.user.id) {
      await interaction.reply({ embeds: [error('Error', 'You cannot give money to yourself.')], ephemeral: true })
      return
    }

    const sender = await getUser(interaction.user.id, interaction.guildId!)
    if (sender.wallet < amount) {
      await interaction.reply({ embeds: [error('Insufficient Funds', `You only have ${formatNumber(sender.wallet)} in your wallet.`)], ephemeral: true })
      return
    }

    const recipient = await getUser(target.id, interaction.guildId!)
    sender.wallet -= amount
    recipient.wallet += amount
    await saveUser(sender)
    await saveUser(recipient)

    await interaction.reply({ embeds: [economy('Transfer Complete', `Gave **${formatNumber(amount)}** to ${target}.`)] })
  },
}

export default command

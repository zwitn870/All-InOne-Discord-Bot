import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { getUser, saveUser } from '../../../shared/services/userService'
import { getGuild } from '../../../shared/services/guildService'
import { economy, error } from '../../../shared/utils/embed'
import { formatNumber } from '../../../shared/utils/functions'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('buy')
    .setDescription('Buy an item from the shop')
    .addStringOption(opt => opt.setName('item').setDescription('Item name').setRequired(true).setAutocomplete(true))
    .addIntegerOption(opt => opt.setName('quantity').setDescription('Quantity').setMinValue(1).setMaxValue(100)),
  async execute(interaction: ChatInputCommandInteraction) {
    const itemName = interaction.options.getString('item', true)
    const quantity = interaction.options.getInteger('quantity') ?? 1

    const guild = await getGuild(interaction.guildId!)
    const item = guild.economy.shop.find(i => i.name.toLowerCase() === itemName.toLowerCase())
    if (!item) {
      await interaction.reply({ embeds: [error('Not Found', 'That item does not exist in the shop.')], ephemeral: true })
      return
    }

    const userData = await getUser(interaction.user.id, interaction.guildId!)
    const totalCost = item.price * quantity

    if (userData.wallet < totalCost) {
      await interaction.reply({ embeds: [error('Insufficient Funds', `You need ${formatNumber(totalCost)} ${guild.economy.currencyIcon}.`)], ephemeral: true })
      return
    }

    userData.wallet -= totalCost
    const existingItem = userData.inventory.find(i => i.name === item.name)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      userData.inventory.push({ name: item.name, quantity })
    }

    if (item.roleId) {
      const member = interaction.guild?.members.cache.get(interaction.user.id)
      await member?.roles.add(item.roleId).catch(() => {})
    }

    await saveUser(userData)
    await interaction.reply({ embeds: [economy('Purchase Complete', `Bought **${quantity}x ${item.name}** for ${formatNumber(totalCost)} ${guild.economy.currencyIcon}.`)] })
  },
}

export default command

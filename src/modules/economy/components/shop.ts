import { ButtonInteraction, StringSelectMenuInteraction, ModalSubmitInteraction } from 'discord.js'
import { ComponentDefinition } from '../../../shared/types'
import { getUser, saveUser } from '../../../shared/services/userService'
import { getGuild } from '../../../shared/services/guildService'
import { economy, error } from '../../../shared/utils/embed'
import { formatNumber } from '../../../shared/utils/functions'

const component: ComponentDefinition = {
  customId: 'shop:buy',
  type: 'select',
  async execute(interaction: ButtonInteraction | StringSelectMenuInteraction | ModalSubmitInteraction) {
    const si = interaction as StringSelectMenuInteraction
    const index = parseInt(si.values[0])
    const guild = await getGuild(si.guildId!)
    const item = guild.economy.shop[index]

    if (!item) {
      await si.reply({ content: 'Item not found.', ephemeral: true })
      return
    }

    const userData = await getUser(si.user.id, si.guildId!)
    if (userData.wallet < item.price) {
      await si.reply({ embeds: [error('Insufficient Funds', `You need ${formatNumber(item.price)} ${guild.economy.currencyIcon}.`)], ephemeral: true })
      return
    }

    userData.wallet -= item.price
    const existing = userData.inventory.find(i => i.name === item.name)
    if (existing) {
      existing.quantity++
    } else {
      userData.inventory.push({ name: item.name, quantity: 1 })
    }

    if (item.roleId) {
      const member = si.guild?.members.cache.get(si.user.id)
      await member?.roles.add(item.roleId).catch(() => {})
    }

    await saveUser(userData)
    await si.reply({ embeds: [economy('Purchased', `Bought **${item.name}** for ${formatNumber(item.price)} ${guild.economy.currencyIcon}.`)], ephemeral: true })
  },
}

export default component

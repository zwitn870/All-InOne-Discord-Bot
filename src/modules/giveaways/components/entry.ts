import { ButtonInteraction, StringSelectMenuInteraction, ModalSubmitInteraction } from 'discord.js'
import { ComponentDefinition } from '../../../shared/types'
import Giveaway from '../../../database/models/Giveaway'
import { getUser } from '../../../shared/services/userService'

const component: ComponentDefinition = {
  customId: 'giveaway:enter',
  type: 'button',
  async execute(interaction: ButtonInteraction | StringSelectMenuInteraction | ModalSubmitInteraction) {
    const bi = interaction as ButtonInteraction
    const giveaway = await Giveaway.findOne({ messageId: bi.message.id, ended: false })
    if (!giveaway) {
      await bi.reply({ content: 'This giveaway has ended.', ephemeral: true })
      return
    }

    if (giveaway.entries.includes(bi.user.id)) {
      giveaway.entries = giveaway.entries.filter(id => id !== bi.user.id)
      await giveaway.save()
      await bi.reply({ content: 'You have left the giveaway.', ephemeral: true })
      return
    }

    for (const req of giveaway.requirements) {
      if (req.type === 'role') {
        const member = bi.guild?.members.cache.get(bi.user.id)
        if (!member?.roles.cache.has(req.value as string)) {
          await bi.reply({ content: `You need the <@&${req.value}> role to enter.`, ephemeral: true })
          return
        }
      }
      if (req.type === 'level') {
        const userData = await getUser(bi.user.id, bi.guildId!)
        if (userData.level < (req.value as number)) {
          await bi.reply({ content: `You need level ${req.value} to enter.`, ephemeral: true })
          return
        }
      }
    }

    giveaway.entries.push(bi.user.id)
    await giveaway.save()
    await bi.reply({ content: 'You entered the giveaway!', ephemeral: true })
  },
}

export default component

import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import Giveaway from '../../../database/models/Giveaway'
import { giveaway } from '../../../shared/utils/embed'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('giveaway-reroll')
    .setDescription('Reroll a giveaway')
    .addStringOption(opt => opt.setName('message-id').setDescription('Message ID of the giveaway').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction: ChatInputCommandInteraction) {
    const messageId = interaction.options.getString('message-id', true)
    const gData = await Giveaway.findOne({ messageId, guildId: interaction.guildId! })

    if (!gData) {
      await interaction.reply({ content: 'Giveaway not found.', ephemeral: true })
      return
    }

    const validEntries = gData.entries.filter(id => id !== interaction.client.user.id)
    if (!validEntries.length) {
      await interaction.reply({ content: 'No valid entries to reroll.', ephemeral: true })
      return
    }

    const winners: string[] = []
    const pool = [...validEntries]
    const count = Math.min(gData.winnerCount, pool.length)

    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * pool.length)
      winners.push(pool.splice(idx, 1)[0])
    }

    gData.winners = winners
    await gData.save()

    const channel = interaction.guild?.channels.cache.get(gData.channelId)
    if (channel?.isTextBased()) {
      await channel.send({ content: `🎉 **Reroll!** New winner(s) for **${gData.prize}**: ${winners.map(id => `<@${id}>`).join(', ')}` })
    }

    await interaction.reply({ content: `Rerolled! Winners: ${winners.map(id => `<@${id}>`).join(', ')}`, ephemeral: true })
  },
}

export default command

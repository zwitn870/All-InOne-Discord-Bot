import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import Giveaway from '../../../database/models/Giveaway'
import { endGiveaway } from '../utils'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('giveaway-end')
    .setDescription('End a giveaway early')
    .addStringOption(opt => opt.setName('message-id').setDescription('Message ID of the giveaway').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction: ChatInputCommandInteraction) {
    const messageId = interaction.options.getString('message-id', true)
    const giveaway = await Giveaway.findOne({ messageId, guildId: interaction.guildId!, ended: false })

    if (!giveaway) {
      await interaction.reply({ content: 'Giveaway not found or already ended.', ephemeral: true })
      return
    }

    giveaway.endAt = new Date()
    await giveaway.save()
    await endGiveaway(giveaway, interaction.client)

    await interaction.reply({ content: 'Giveaway ended.', ephemeral: true })
  },
}

export default command

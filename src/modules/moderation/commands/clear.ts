import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, TextChannel } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clear messages in the channel')
    .addIntegerOption(opt => opt.setName('amount').setDescription('Number of messages to delete').setRequired(true).setMinValue(1).setMaxValue(100))
    .addUserOption(opt => opt.setName('user').setDescription('Only delete messages from this user'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction: ChatInputCommandInteraction) {
    const amount = interaction.options.getInteger('amount', true)
    const user = interaction.options.getUser('user')
    const channel = interaction.channel as TextChannel

    if (user) {
      const messages = await channel.messages.fetch({ limit: 100 })
      const filtered = messages.filter(m => m.author.id === user.id).first(amount)
      if (filtered.length) {
        await channel.bulkDelete(filtered, true)
      }
      await interaction.reply({ content: `Deleted ${filtered.length} messages from ${user.tag}.`, ephemeral: true })
    } else {
      await channel.bulkDelete(amount, true)
      await interaction.reply({ content: `Deleted ${amount} messages.`, ephemeral: true })
    }
  },
}

export default command

import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { getUser } from '../../../shared/services/userService'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('Check your inventory')
    .addUserOption(opt => opt.setName('user').setDescription('User to check')),
  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getUser('user') ?? interaction.user
    const userData = await getUser(target.id, interaction.guildId!)

    if (!userData.inventory.length) {
      await interaction.reply({ content: `${target.username} has no items.`, ephemeral: true })
      return
    }

    const embed = new EmbedBuilder()
      .setColor(0xF1C40F)
      .setAuthor({ name: target.username, iconURL: target.displayAvatarURL() })
      .setTitle('Inventory')
      .setDescription(userData.inventory.map(i => `**${i.name}** x${i.quantity}`).join('\n'))
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  },
}

export default command

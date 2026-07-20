import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { getUser, saveUser } from '../../../shared/services/userService'
import { economy, error } from '../../../shared/utils/embed'
import { randomRange, formatNumber } from '../../../shared/utils/functions'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('rob')
    .setDescription('Try to rob another user')
    .addUserOption(opt => opt.setName('user').setDescription('User to rob').setRequired(true)),
  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getUser('user', true)

    if (target.id === interaction.user.id) {
      await interaction.reply({ embeds: [error('Error', 'You cannot rob yourself.')], ephemeral: true })
      return
    }

    const robber = await getUser(interaction.user.id, interaction.guildId!)
    const victim = await getUser(target.id, interaction.guildId!)

    if (victim.wallet < 50) {
      await interaction.reply({ embeds: [error('Poor Target', 'This user has almost nothing in their wallet.')], ephemeral: true })
      return
    }

    if (robber.wallet < 100) {
      await interaction.reply({ embeds: [error('Broke', 'You need at least 100 currency to attempt a robbery.')], ephemeral: true })
      return
    }

    const success = Math.random() < 0.4

    if (success) {
      const stolen = Math.floor(victim.wallet * randomRange(10, 30) / 100)
      victim.wallet -= stolen
      robber.wallet += stolen
      await saveUser(robber)
      await saveUser(victim)
      await interaction.reply({ embeds: [economy('Robbery Successful', `You stole **${formatNumber(stolen)}** from ${target}!`)] })
    } else {
      const fine = Math.floor(randomRange(50, 200))
      robber.wallet = Math.max(0, robber.wallet - fine)
      await saveUser(robber)
      await interaction.reply({ embeds: [error('Robbery Failed', `You got caught and paid a fine of **${formatNumber(fine)}**.`)], ephemeral: true })
    }
  },
}

export default command

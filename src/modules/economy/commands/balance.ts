import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { getUser } from '../../../shared/services/userService'
import { getGuild } from '../../../shared/services/guildService'
import { formatNumber } from '../../../shared/utils/functions'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your or another user\'s balance')
    .addUserOption(opt => opt.setName('user').setDescription('User to check')),
  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getUser('user') ?? interaction.user
    const userData = await getUser(target.id, interaction.guildId!)
    const guild = await getGuild(interaction.guildId!)
    const icon = guild.economy.currencyIcon ?? '🪙'

    const embed = new EmbedBuilder()
      .setColor(0xF1C40F)
      .setAuthor({ name: target.username, iconURL: target.displayAvatarURL() })
      .setTitle('Balance')
      .addFields(
        { name: `${icon} Wallet`, value: formatNumber(userData.wallet), inline: true },
        { name: `🏦 Bank`, value: formatNumber(userData.bank), inline: true },
        { name: `💰 Total`, value: formatNumber(userData.wallet + userData.bank), inline: true },
      )
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  },
}

export default command

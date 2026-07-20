import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { getGuild } from '../../../shared/services/guildService'
import { formatNumber } from '../../../shared/utils/functions'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('Browse the server shop'),
  async execute(interaction: ChatInputCommandInteraction) {
    const guild = await getGuild(interaction.guildId!)
    const shop = guild.economy.shop

    if (!shop.length) {
      await interaction.reply({ content: 'The shop is empty.', ephemeral: true })
      return
    }

    const embed = new EmbedBuilder()
      .setColor(0xF1C40F)
      .setTitle(`${guild.economy.currencyIcon} Server Shop`)
      .setDescription(
        shop.map((item, i) =>
          `${item.emoji ?? '📦'} **${i + 1}. ${item.name}** — ${formatNumber(item.price)} ${guild.economy.currencyIcon}\n${item.description}`
        ).join('\n\n')
      )
      .setTimestamp()

    const select = new StringSelectMenuBuilder()
      .setCustomId('shop:buy')
      .setPlaceholder('Select an item to buy')
      .addOptions(
        shop.map((item, i) =>
          new StringSelectMenuOptionBuilder()
            .setLabel(item.name)
            .setDescription(`${formatNumber(item.price)} ${guild.economy.currencyIcon}`)
            .setValue(i.toString())
            .setEmoji(item.emoji ?? '📦')
        )
      )

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select)
    await interaction.reply({ embeds: [embed], components: [row] })
  },
}

export default command

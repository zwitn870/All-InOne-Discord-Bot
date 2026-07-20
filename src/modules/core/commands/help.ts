import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'

const modules: Record<string, { emoji: string; description: string }> = {
  tickets: { emoji: '🎫', description: 'Ticket system management' },
  moderation: { emoji: '🛡️', description: 'Server moderation tools' },
  music: { emoji: '🎵', description: 'Music playback and queue' },
  leveling: { emoji: '⭐', description: 'XP ranks and leveling' },
  economy: { emoji: '💰', description: 'Currency and economy' },
  giveaways: { emoji: '🎉', description: 'Giveaway management' },
  core: { emoji: '⚙️', description: 'Core bot commands' },
}

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available commands')
    .addStringOption(opt =>
      opt.setName('module')
        .setDescription('Module to show commands for')
        .addChoices(
          { name: 'Tickets', value: 'tickets' },
          { name: 'Moderation', value: 'moderation' },
          { name: 'Music', value: 'music' },
          { name: 'Leveling', value: 'leveling' },
          { name: 'Economy', value: 'economy' },
          { name: 'Giveaways', value: 'giveaways' },
        )
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const moduleFilter = interaction.options.getString('module')
    const allCommands = interaction.client.commands

    if (moduleFilter) {
      const mod = modules[moduleFilter]
      const cmds = allCommands.filter(c => c.module === moduleFilter)

      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle(`${mod.emoji} ${moduleFilter.charAt(0).toUpperCase() + moduleFilter.slice(1)} Commands`)
        .setDescription(mod.description)
        .addFields(
          cmds.map(c => ({
            name: `/${c.data.name}`,
            value: c.data.description,
            inline: false,
          }))
        )
        .setTimestamp()

      await interaction.reply({ embeds: [embed] })
      return
    }

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('All-InOne Bot Commands')
      .setDescription('Select a module below for specific commands, or browse all.')
      .setTimestamp()

    for (const [key, mod] of Object.entries(modules)) {
      const cmds = allCommands.filter(c => c.module === key)
      if (cmds.size === 0) continue
      embed.addFields({
        name: `${mod.emoji} ${key.charAt(0).toUpperCase() + key.slice(1)} (${cmds.size})`,
        value: cmds.map(c => `\`/${c.data.name}\``).join(', '),
        inline: false,
      })
    }

    await interaction.reply({ embeds: [embed] })
  },
}

export default command

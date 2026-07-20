import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { setVolume, getVolume } from '../structures/Player'
import { music } from '../../../shared/utils/embed'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Set the playback volume')
    .addIntegerOption(opt => opt.setName('level').setDescription('Volume 0-200').setRequired(true).setMinValue(0).setMaxValue(200)),
  async execute(interaction: ChatInputCommandInteraction) {
    const level = interaction.options.getInteger('level', true)
    setVolume(interaction.guildId!, level)
    await interaction.reply({ embeds: [music('Volume', `Volume set to **${level}%**`)] })
  },
}

export default command

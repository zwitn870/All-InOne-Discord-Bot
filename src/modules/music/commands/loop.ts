import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'
import { setLoopMode, getPlayer } from '../structures/Player'
import { music } from '../../../shared/utils/embed'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Set loop mode')
    .addStringOption(opt =>
      opt.setName('mode')
        .setDescription('Loop mode')
        .setRequired(true)
        .addChoices(
          { name: 'None', value: 'none' },
          { name: 'Song', value: 'song' },
          { name: 'Queue', value: 'queue' },
        )
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const mode = interaction.options.getString('mode', true) as 'none' | 'song' | 'queue'
    setLoopMode(interaction.guildId!, mode)
    await interaction.reply({ embeds: [music('Loop Mode', `Loop mode set to **${mode}**`)] })
  },
}

export default command

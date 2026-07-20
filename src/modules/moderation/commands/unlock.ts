import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, ChannelType, TextChannel } from 'discord.js'
import { CommandDefinition } from '../../../shared/types'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlock a channel')
    .addChannelOption(opt => opt.setName('channel').setDescription('Channel to unlock').addChannelTypes(ChannelType.GuildText))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction: ChatInputCommandInteraction) {
    const channel = (interaction.options.getChannel('channel') ?? interaction.channel!) as TextChannel

    await channel.edit({
      permissionOverwrites: [
        ...channel.permissionOverwrites.cache.map(p => p),
        { id: interaction.guildId!, allow: [PermissionFlagsBits.SendMessages] },
      ],
    })

    await interaction.reply({ content: `Unlocked ${channel}.` })
  },
}

export default command

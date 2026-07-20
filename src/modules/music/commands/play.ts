import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember, VoiceChannel } from 'discord.js'
import { joinVoiceChannel } from '@discordjs/voice'
import { CommandDefinition } from '../../../shared/types'
import { addSong, addSongs, setConnection, playNow, searchSong, getQueue } from '../structures/Player'
import { music, error } from '../../../shared/utils/embed'

const command: CommandDefinition = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song or add to queue')
    .addStringOption(opt => opt.setName('query').setDescription('Song name or URL').setRequired(true)),
  async execute(interaction: ChatInputCommandInteraction) {
    const query = interaction.options.getString('query', true)
    const member = interaction.member as GuildMember
    const voiceChannel = member.voice.channel

    if (!voiceChannel) {
      await interaction.reply({ embeds: [error('Error', 'You must be in a voice channel.')], ephemeral: true })
      return
    }

    await interaction.deferReply()

    const songs = await searchSong(query)

    if (!songs.length) {
      await interaction.editReply({ embeds: [error('Error', 'No results found.')] })
      return
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guildId!,
      adapterCreator: interaction.guild!.voiceAdapterCreator as any,
    })

    setConnection(interaction.guildId!, connection)

    const requestedSongs = songs.map(s => ({ ...s, requestedBy: interaction.user.id }))

    if (requestedSongs.length === 1) {
      const index = addSong(interaction.guildId!, requestedSongs[0])
      if (index === 0) await playNow(interaction.guildId!)

      const embed = music('Added to Queue', `[${requestedSongs[0].title}](${requestedSongs[0].url})`)
        .setFooter({ text: `Requested by ${interaction.user.username}` })
        .setThumbnail(requestedSongs[0].thumbnail ?? null)

      await interaction.editReply({ embeds: [embed] })
    } else {
      addSongs(interaction.guildId!, requestedSongs)
      const q = getQueue(interaction.guildId!)
      if (q.length === requestedSongs.length) await playNow(interaction.guildId!)

      const embed = music('Added Playlist', `Added **${requestedSongs.length}** songs to the queue.`)
      await interaction.editReply({ embeds: [embed] })
    }
  },
}

export default command

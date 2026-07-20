import { getVoiceConnection, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnection, AudioPlayer, NoSubscriberBehavior, StreamType } from '@discordjs/voice'
import { Guild, ChatInputCommandInteraction } from 'discord.js'
import play from 'play-dl'
import { Song } from '../../../shared/types'
import { info, error } from '../../../shared/utils/logger'

interface GuildPlayer {
  player: AudioPlayer
  queue: Song[]
  currentIndex: number
  loopMode: 'none' | 'song' | 'queue'
  volume: number
  currentSong: Song | null
  connection: VoiceConnection | null
}

const players = new Map<string, GuildPlayer>()

export function getPlayer(guildId: string): GuildPlayer | undefined {
  return players.get(guildId)
}

export function ensurePlayer(guildId: string): GuildPlayer {
  let gp = players.get(guildId)
  if (!gp) {
    gp = {
      player: createAudioPlayer({
        behaviors: { noSubscriber: NoSubscriberBehavior.Play },
      }),
      queue: [],
      currentIndex: -1,
      loopMode: 'none',
      volume: 100,
      currentSong: null,
      connection: null,
    }

    gp.player.on(AudioPlayerStatus.Idle, () => {
      if (!gp) return
      playNext(guildId)
    })

    gp.player.on('error', (err) => {
      error('Audio player error:', err.message)
      if (gp) playNext(guildId)
    })

    players.set(guildId, gp)
  }
  return gp
}

export function destroyPlayer(guildId: string) {
  const gp = players.get(guildId)
  if (gp) {
    gp.player.stop(true)
    const connection = getVoiceConnection(guildId)
    if (connection) connection.destroy()
    players.delete(guildId)
  }
}

export function setConnection(guildId: string, connection: VoiceConnection) {
  const gp = ensurePlayer(guildId)
  gp.connection = connection
  connection.subscribe(gp.player)
}

export function addSong(guildId: string, song: Song): number {
  const gp = ensurePlayer(guildId)
  gp.queue.push(song)
  return gp.queue.length - 1
}

export function addSongs(guildId: string, songs: Song[]): void {
  const gp = ensurePlayer(guildId)
  gp.queue.push(...songs)
}

export function removeSong(guildId: string, index: number): Song | null {
  const gp = players.get(guildId)
  if (!gp || index < 0 || index >= gp.queue.length) return null
  return gp.queue.splice(index, 1)[0]
}

export function clearQueue(guildId: string) {
  const gp = players.get(guildId)
  if (gp) {
    gp.queue = []
    gp.currentIndex = -1
  }
}

export function shuffleQueue(guildId: string) {
  const gp = players.get(guildId)
  if (!gp || gp.queue.length < 2) return
  for (let i = gp.queue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [gp.queue[i], gp.queue[j]] = [gp.queue[j], gp.queue[i]]
  }
}

export function setLoopMode(guildId: string, mode: 'none' | 'song' | 'queue') {
  const gp = ensurePlayer(guildId)
  gp.loopMode = mode
}

export function getQueue(guildId: string): Song[] {
  return players.get(guildId)?.queue ?? []
}

export function getCurrentSong(guildId: string): Song | null {
  return players.get(guildId)?.currentSong ?? null
}

export function setVolume(guildId: string, volume: number) {
  const gp = players.get(guildId)
  if (gp) gp.volume = Math.max(0, Math.min(200, volume))
}

export function getVolume(guildId: string): number {
  return players.get(guildId)?.volume ?? 100
}

async function playNext(guildId: string) {
  const gp = players.get(guildId)
  if (!gp || !gp.connection) return

  if (gp.queue.length === 0) {
    gp.currentSong = null
    gp.currentIndex = -1
    return
  }

  if (gp.loopMode === 'song' && gp.currentSong) {
    await playSong(guildId, gp.currentSong)
    return
  }

  if (gp.loopMode === 'queue') {
    gp.currentIndex = (gp.currentIndex + 1) % gp.queue.length
  } else {
    gp.currentIndex++
  }

  if (gp.currentIndex >= gp.queue.length) {
    gp.currentSong = null
    gp.currentIndex = -1
    return
  }

  const song = gp.queue[gp.currentIndex]
  await playSong(guildId, song)
}

async function playSong(guildId: string, song: Song) {
  const gp = players.get(guildId)
  if (!gp) return

  gp.currentSong = song

  try {
    let stream: Awaited<ReturnType<typeof play.stream>>

    if (song.url.includes('spotify')) {
      const search = await play.search(`${song.title} ${song.author ?? ''}`, { limit: 1 })
      if (!search.length) {
        playNext(guildId)
        return
      }
      stream = await play.stream(search[0].url)
    } else {
      stream = await play.stream(song.url)
    }

    const resource = createAudioResource(stream.stream, {
      inputType: stream.type,
      inlineVolume: true,
    })

    resource.volume?.setVolume(gp.volume / 100)
    gp.player.play(resource)
  } catch (err) {
    error(`Failed to play song: ${song.title}`, err)
    playNext(guildId)
  }
}

export async function playNow(guildId: string) {
  const gp = players.get(guildId)
  if (!gp) return

  if (gp.currentIndex < 0 && gp.queue.length > 0) {
    gp.currentIndex = 0
  }

  await playNext(guildId)
}

export function skip(guildId: string): boolean {
  const gp = players.get(guildId)
  if (!gp || gp.queue.length === 0) return false
  gp.player.stop()
  return true
}

export function stop(guildId: string) {
  const gp = players.get(guildId)
  if (gp) {
    gp.queue = []
    gp.currentIndex = -1
    gp.currentSong = null
    gp.player.stop(true)
  }
}

export async function searchSong(query: string): Promise<Song[]> {
  try {
    if (query.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|open\.spotify\.com)\/.+/)) {
      if (query.includes('open.spotify.com')) {
        if (query.includes('/track/')) {
          const track: any = await play.spotify(query)
          return [{
            title: track.name ?? 'Unknown',
            url: query,
            duration: 0,
            requestedBy: '',
            thumbnail: '',
            author: track.artists?.[0]?.name,
          }]
        }
        if (query.includes('/playlist/')) {
          const playlist: any = await play.spotify(query)
          if ('tracks' in playlist) {
            return playlist.tracks?.map((t: any) => ({
              title: t.name,
              url: t.url,
              duration: 0,
              requestedBy: '',
              thumbnail: '',
              author: t.artists?.[0]?.name,
            })) ?? []
          }
          return []
        }
      }

      if (query.includes('youtube.com/playlist')) {
        const playlist = await play.playlist_info(query)
        const videos = await playlist.all_videos()
        return videos.map(v => ({
          title: v.title ?? 'Unknown',
          url: v.url,
          duration: v.durationInSec ?? 0,
          requestedBy: '',
          thumbnail: v.thumbnails?.[0]?.url ?? '',
          author: v.channel?.name,
        }))
      }

      const info = await play.video_info(query)
      return [{
        title: info.video_details?.title ?? 'Unknown',
        url: query,
        duration: info.video_details?.durationInSec ?? 0,
        requestedBy: '',
        thumbnail: info.video_details?.thumbnails?.[0]?.url ?? '',
        author: info.video_details?.channel?.name,
      }]
    }

    const results = await play.search(query, { limit: 5 })
    return results.map(r => ({
      title: r.title ?? 'Unknown',
      url: r.url,
      duration: r.durationInSec ?? 0,
      requestedBy: '',
      thumbnail: r.thumbnails?.[0]?.url ?? '',
      author: r.channel?.name,
    }))
  } catch {
    return []
  }
}

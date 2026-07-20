import dotenv from 'dotenv'
import { BotConfig } from './shared/types'

dotenv.config()

function required(key: string, env?: string): string {
  if (!env) throw new Error(`Missing required environment variable: ${key}`)
  return env
}

export const config: BotConfig = {
  token: required('DISCORD_TOKEN', process.env.DISCORD_TOKEN),
  clientId: required('DISCORD_CLIENT_ID', process.env.DISCORD_CLIENT_ID),
  mongoUri: required('MONGO_URI', process.env.MONGO_URI),
  spotifyClientId: process.env.SPOTIFY_CLIENT_ID ?? '',
  spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET ?? '',
}

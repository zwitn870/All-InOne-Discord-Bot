import { EmbedBuilder, ColorResolvable } from 'discord.js'

const PRIMARY: ColorResolvable = 0x5865F2
const SUCCESS: ColorResolvable = 0x57F287
const WARNING: ColorResolvable = 0xFEE75C
const ERROR: ColorResolvable = 0xED4245
const MUSIC: ColorResolvable = 0x1DB954
const ECONOMY: ColorResolvable = 0xF1C40F
const GIVEAWAY: ColorResolvable = 0x9B59B6
const TICKET: ColorResolvable = 0x00A8FF

export function primary(title: string, description?: string) {
  return new EmbedBuilder().setColor(PRIMARY).setTitle(title).setDescription(description ?? null).setTimestamp()
}

export function success(title: string, description?: string) {
  return new EmbedBuilder().setColor(SUCCESS).setTitle(title).setDescription(description ?? null).setTimestamp()
}

export function warning(title: string, description?: string) {
  return new EmbedBuilder().setColor(WARNING).setTitle(title).setDescription(description ?? null).setTimestamp()
}

export function error(title: string, description?: string) {
  return new EmbedBuilder().setColor(ERROR).setTitle(title).setDescription(description ?? null).setTimestamp()
}

export function music(title: string, description?: string) {
  return new EmbedBuilder().setColor(MUSIC).setTitle(title).setDescription(description ?? null).setTimestamp()
}

export function economy(title: string, description?: string) {
  return new EmbedBuilder().setColor(ECONOMY).setTitle(title).setDescription(description ?? null).setTimestamp()
}

export function giveaway(title: string, description?: string) {
  return new EmbedBuilder().setColor(GIVEAWAY).setTitle(title).setDescription(description ?? null).setTimestamp()
}

export function ticket(title: string, description?: string) {
  return new EmbedBuilder().setColor(TICKET).setTitle(title).setDescription(description ?? null).setTimestamp()
}

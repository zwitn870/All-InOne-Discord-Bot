import { SlashCommandBuilder, ChatInputCommandInteraction, ButtonInteraction, StringSelectMenuInteraction, ModalSubmitInteraction, CommandInteraction, GuildMember, TextChannel, CategoryChannel, VoiceBasedChannel, Collection, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js'

export interface BotConfig {
  token: string
  clientId: string
  mongoUri: string
  spotifyClientId: string
  spotifyClientSecret: string
}

export interface TicketConfig {
  categoryId: string
  channelId: string
  supportRoleIds: string[]
  messageId?: string
}

export interface LevelRole {
  level: number
  roleId: string
}

export interface ShopItem {
  name: string
  description: string
  price: number
  roleId?: string
  emoji?: string
}

export interface Song {
  title: string
  url: string
  duration: number
  requestedBy: string
  thumbnail?: string
  author?: string
}

export interface QueueData {
  guildId: string
  songs: Song[]
  currentIndex: number
  loopMode: 'none' | 'song' | 'queue'
  volume: number
}

export interface GiveawayRequirement {
  type: 'role' | 'level' | 'invites'
  value: string | number
}

export interface GiveawayData {
  guildId: string
  channelId: string
  messageId: string
  prize: string
  description: string
  winners: number
  endAt: Date
  requirements: GiveawayRequirement[]
  entries: string[]
  ended: boolean
}

export interface InventoryItem {
  name: string
  quantity: number
}

type CommandData = SlashCommandBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'> | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, CommandDefinition>
    components: Collection<string, ComponentHandler>
    cooldowns: Collection<string, Collection<string, number>>
  }
}

export interface CommandDefinition {
  data: CommandData
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>
  autocomplete?: (interaction: CommandInteraction) => Promise<void>
  cooldown?: number
  module?: string
}

export type ComponentHandler = (interaction: ButtonInteraction | StringSelectMenuInteraction | ModalSubmitInteraction) => Promise<void>

export interface ComponentDefinition {
  customId: string
  type: 'button' | 'select' | 'modal'
  execute: ComponentHandler
}

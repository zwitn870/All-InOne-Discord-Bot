import { Schema, model, Document } from 'mongoose'

export interface IGuild extends Document {
  guildId: string
  tickets: {
    categoryId: string
    channelId: string
    supportRoleIds: string[]
    messageId: string
    ticketCounter: number
  }
  moderation: {
    modRoles: string[]
    muteRoleId: string
    logChannelId: string
  }
  leveling: {
    enabled: boolean
    multiplier: number
    levelRoles: { level: number; roleId: string }[]
    messageXp: number
    voiceXp: number
  }
  economy: {
    enabled: boolean
    currencyName: string
    currencyIcon: string
    shop: { name: string; description: string; price: number; roleId?: string; emoji?: string }[]
    dailyAmount: number
    workMin: number
    workMax: number
  }
  music: {
    volume: number
    defaultPlaylist: string[]
  }
  giveaways: {
    channelId: string
    dmWinners: boolean
  }
}

const GuildSchema = new Schema<IGuild>({
  guildId: { type: String, required: true, unique: true },
  tickets: {
    type: new Schema({
      categoryId: { type: String, default: '' },
      channelId: { type: String, default: '' },
      supportRoleIds: { type: [String], default: [] },
      messageId: { type: String, default: '' },
      ticketCounter: { type: Number, default: 0 },
    }, { _id: false }),
    default: {},
  },
  moderation: {
    type: new Schema({
      modRoles: { type: [String], default: [] },
      muteRoleId: { type: String, default: '' },
      logChannelId: { type: String, default: '' },
    }, { _id: false }),
    default: {},
  },
  leveling: {
    type: new Schema({
      enabled: { type: Boolean, default: true },
      multiplier: { type: Number, default: 1 },
      levelRoles: { type: [{ level: Number, roleId: String }], default: [] },
      messageXp: { type: Number, default: 15 },
      voiceXp: { type: Number, default: 5 },
    }, { _id: false }),
    default: {},
  },
  economy: {
    type: new Schema({
      enabled: { type: Boolean, default: true },
      currencyName: { type: String, default: 'coins' },
      currencyIcon: { type: String, default: '🪙' },
      shop: { type: [{ name: String, description: String, price: Number, roleId: String, emoji: String }], default: [] },
      dailyAmount: { type: Number, default: 500 },
      workMin: { type: Number, default: 50 },
      workMax: { type: Number, default: 200 },
    }, { _id: false }),
    default: {},
  },
  music: {
    type: new Schema({
      volume: { type: Number, default: 100 },
      defaultPlaylist: { type: [String], default: [] },
    }, { _id: false }),
    default: {},
  },
  giveaways: {
    type: new Schema({
      channelId: { type: String, default: '' },
      dmWinners: { type: Boolean, default: true },
    }, { _id: false }),
    default: {},
  },
})

export default model<IGuild>('Guild', GuildSchema)

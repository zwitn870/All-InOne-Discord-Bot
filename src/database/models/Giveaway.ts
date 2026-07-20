import { Schema, model, Document } from 'mongoose'

export interface IGiveaway extends Document {
  guildId: string
  channelId: string
  messageId: string
  prize: string
  description: string
  winnerCount: number
  endAt: Date
  requirements: { type: 'role' | 'level'; value: string | number }[]
  entries: string[]
  ended: boolean
  endedAt: Date | null
  winners: string[]
  hostedBy: string
}

const GiveawaySchema = new Schema<IGiveaway>({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
  messageId: { type: String, required: true, unique: true },
  prize: { type: String, required: true },
  description: { type: String, default: '' },
  winnerCount: { type: Number, required: true },
  endAt: { type: Date, required: true },
  requirements: { type: [{ type: { type: String, enum: ['role', 'level'] }, value: Schema.Types.Mixed }], default: [] },
  entries: { type: [String], default: [] },
  ended: { type: Boolean, default: false },
  endedAt: { type: Date, default: null },
  winners: { type: [String], default: [] },
  hostedBy: { type: String, default: '' },
})

export default model<IGiveaway>('Giveaway', GiveawaySchema)

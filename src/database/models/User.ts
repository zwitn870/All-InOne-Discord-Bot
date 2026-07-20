import { Schema, model, Document } from 'mongoose'

export interface IUser extends Document {
  userId: string
  guildId: string
  xp: number
  level: number
  wallet: number
  bank: number
  inventory: { name: string; quantity: number }[]
  lastDaily: Date | null
  lastWeekly: Date | null
  lastWork: Date | null
  warnings: { moderatorId: string; reason: string; date: Date }[]
  totalMessages: number
  voiceMinutes: number
}

const UserSchema = new Schema<IUser>({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 0 },
  wallet: { type: Number, default: 0 },
  bank: { type: Number, default: 0 },
  inventory: { type: [{ name: String, quantity: Number }], default: [] },
  lastDaily: { type: Date, default: null },
  lastWeekly: { type: Date, default: null },
  lastWork: { type: Date, default: null },
  warnings: { type: [{ moderatorId: String, reason: String, date: { type: Date, default: Date.now } }], default: [] },
  totalMessages: { type: Number, default: 0 },
  voiceMinutes: { type: Number, default: 0 },
})

UserSchema.index({ userId: 1, guildId: 1 }, { unique: true })

export default model<IUser>('User', UserSchema)

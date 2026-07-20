import { Schema, model, Document } from 'mongoose'

export interface ITicket extends Document {
  guildId: string
  channelId: string
  authorId: string
  claimedById: string | null
  subject: string
  ticketNumber: number
  status: 'open' | 'claimed' | 'closed'
  members: string[]
  createdAt: Date
  closedAt: Date | null
}

const TicketSchema = new Schema<ITicket>({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true, unique: true },
  authorId: { type: String, required: true },
  claimedById: { type: String, default: null },
  subject: { type: String, default: 'No subject' },
  ticketNumber: { type: Number, required: true },
  status: { type: String, enum: ['open', 'claimed', 'closed'], default: 'open' },
  members: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  closedAt: { type: Date, default: null },
})

export default model<ITicket>('Ticket', TicketSchema)

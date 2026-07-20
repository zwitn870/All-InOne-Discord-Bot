import { Events, Message } from 'discord.js'
import { Client } from '../../../core/Client'

export default {
  name: Events.MessageCreate,
  execute(client: Client, message: Message) {
    // Reserved for future ticket message handling
  },
}

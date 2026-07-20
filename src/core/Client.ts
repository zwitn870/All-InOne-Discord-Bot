import { Client as DJSClient, Collection, GatewayIntentBits, Partials } from 'discord.js'
import { config } from '../config'
import { CommandDefinition, ComponentHandler } from '../shared/types'
import { connect } from '../database/connection'
import { info, error } from '../shared/utils/logger'
import { loadModule } from './Loader'

export class Client extends DJSClient {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildModeration,
      ],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    })

    this.commands = new Collection<string, CommandDefinition>()
    this.components = new Collection<string, ComponentHandler>()
    this.cooldowns = new Collection<string, Collection<string, number>>()
  }

  async start() {
    try {
      await connect(config.mongoUri)
      info('Database connected')

      await loadModule(this, 'tickets')
      await loadModule(this, 'moderation')
      await loadModule(this, 'music')
      await loadModule(this, 'leveling')
      await loadModule(this, 'economy')
      await loadModule(this, 'giveaways')
      await loadModule(this, 'core')
      info('All modules loaded')

      await this.login(config.token)
      info(`Logged in as ${this.user?.tag}`)
    } catch (err) {
      error('Failed to start bot', err)
      process.exit(1)
    }
  }
}

import { REST, Routes, SlashCommandBuilder } from 'discord.js'
import { Client } from './Client'
import { config } from '../config'
import { CommandDefinition } from '../shared/types'
import { info, warn } from '../shared/utils/logger'

export async function loadModule(client: Client, name: string) {
  try {
    const mod = await import(`../modules/${name}/index`)
    const commands: CommandDefinition[] = mod.commands ?? []
    const events = mod.events ?? []
    const components = mod.components ?? []

    for (const cmd of commands) {
      cmd.module = name
      client.commands.set(cmd.data.name, cmd)
    }

    for (const evt of events) {
      client.on(evt.name, (...args: unknown[]) => evt.execute(client, ...args))
    }

    for (const comp of components) {
      client.components.set(comp.customId, comp.execute)
    }

    info(`Module ${name}: ${commands.length} commands, ${events.length} events, ${components.length} components`)
  } catch (err) {
    warn(`Failed to load module ${name}`, err)
  }
}

export async function registerCommands(client: Client) {
  const rest = new REST({ version: '10' }).setToken(config.token)
  const commands = client.commands.map(cmd => cmd.data.toJSON())

  try {
    await rest.put(Routes.applicationCommands(config.clientId), { body: commands })
    info(`Registered ${commands.length} global commands`)
  } catch (err) {
    warn('Failed to register commands', err)
  }
}

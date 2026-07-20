import { Client } from './core/Client'
import { Events, Interaction, Collection } from 'discord.js'
import { registerCommands } from './core/Loader'
import { checkGiveaways } from './modules/giveaways/utils'
import { info, error } from './shared/utils/logger'

const client = new Client()

client.on(Events.ClientReady, async () => {
  await registerCommands(client)
  setInterval(() => checkGiveaways(client), 15000)
  info('Giveaway checker started')
})

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName)
    if (!command) return

    if (command.cooldown) {
      const cooldowns = client.cooldowns
      if (!cooldowns.has(command.data.name)) {
        cooldowns.set(command.data.name, new Collection())
      }

      const now = Date.now()
      const timestamps = cooldowns.get(command.data.name)!
      const cooldownAmount = command.cooldown * 1000

      if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id)! + cooldownAmount
        if (now < expirationTime) {
          const timeLeft = ((expirationTime - now) / 1000).toFixed(1)
          await interaction.reply({ content: `Please wait ${timeLeft}s before using this command again.`, ephemeral: true })
          return
        }
      }

      timestamps.set(interaction.user.id, now)
      setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount)
    }

    try {
      await command.execute(interaction)
    } catch (err) {
      error(`Command error: ${interaction.commandName}`, err)
      const reply = interaction.replied || interaction.deferred
        ? interaction.followUp.bind(interaction)
        : interaction.reply.bind(interaction)
      await reply({ content: 'An error occurred while executing this command.', ephemeral: true })
    }
    return
  }

  if (interaction.isButton()) {
    const handler = client.components.get(interaction.customId)
    if (handler) {
      try {
        await handler(interaction)
      } catch (err) {
        error(`Button error: ${interaction.customId}`, err)
        await interaction.reply({ content: 'An error occurred.', ephemeral: true }).catch(() => {})
      }
    }
    return
  }

  if (interaction.isStringSelectMenu()) {
    const handler = client.components.get(interaction.customId)
    if (handler) {
      try {
        await handler(interaction)
      } catch (err) {
        error(`Select error: ${interaction.customId}`, err)
        await interaction.reply({ content: 'An error occurred.', ephemeral: true }).catch(() => {})
      }
    }
    return
  }

  if (interaction.isModalSubmit()) {
    const handler = client.components.get(interaction.customId)
    if (handler) {
      try {
        await handler(interaction)
      } catch (err) {
        error(`Modal error: ${interaction.customId}`, err)
        await interaction.reply({ content: 'An error occurred.', ephemeral: true }).catch(() => {})
      }
    }
  }
})

client.start()

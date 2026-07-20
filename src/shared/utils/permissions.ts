import { ChatInputCommandInteraction, ButtonInteraction, StringSelectMenuInteraction, GuildMember, PermissionFlagsBits } from 'discord.js'
import Guild from '../../database/models/Guild'

export async function hasModRole(interaction: ChatInputCommandInteraction | ButtonInteraction | StringSelectMenuInteraction): Promise<boolean> {
  if (!interaction.member || !interaction.guildId) return false
  const member = interaction.member as GuildMember
  if (member.permissions.has(PermissionFlagsBits.Administrator)) return true
  const guild = await Guild.findOne({ guildId: interaction.guildId })
  if (!guild?.moderation?.modRoles?.length) return false
  return member.roles.cache.some(r => guild.moderation!.modRoles!.includes(r.id))
}

export function requiresMod(interaction: ChatInputCommandInteraction): boolean {
  const member = interaction.member as GuildMember
  return member.permissions.has(PermissionFlagsBits.ModerateMembers) || member.permissions.has(PermissionFlagsBits.Administrator)
}

export function requiresAdmin(interaction: ChatInputCommandInteraction): boolean {
  const member = interaction.member as GuildMember
  return member.permissions.has(PermissionFlagsBits.Administrator)
}

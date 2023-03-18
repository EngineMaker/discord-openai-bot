import { Interaction } from 'discord.js'

export interface SlashCommand {
  name: string
  description: string
  execute: (interaction: Interaction) => Promise<void>
}

// export * from './prompt'

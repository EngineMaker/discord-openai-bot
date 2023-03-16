import {
  Client,
  Events,
  GatewayIntentBits,
  Interaction,
  REST,
  Routes,
} from 'discord.js'

import dotenv from 'dotenv'
dotenv.config()

const main = () => {
  const commands = [
    {
      name: 'ping',
      description: 'Replies with Pong!',
    },
  ]

  // 環境変数のチェック
  if (!process.env.DISCORD_TOKEN) {
    console.error('DISCORD_TOKEN is not set')
    return
  }

  if (!process.env.APP_ID) {
    console.error('APP_ID is not set')
    return
  }

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN)
  rest.put(Routes.applicationCommands(process.env.APP_ID), {
    body: commands,
  })

  const client = new Client({ intents: [GatewayIntentBits.Guilds] })

  client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`)
  })

  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return

    if (interaction.commandName === 'ping') {
      await interaction.reply('Pong!')
    }
  })

  client.login(process.env.DISCORD_TOKEN)
}

main()

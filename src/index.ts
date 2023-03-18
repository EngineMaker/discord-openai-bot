import { Client, Events, GatewayIntentBits, ShardEvents } from 'discord.js'

import dotenv from 'dotenv'
import { checkEnvVars } from './checkEnvVars'
import { onInteractionCreate, onMessageCreate } from './discord/events'
import { registerSlashCommands } from './discord/registerSlashCommands'

dotenv.config()

const main = () => {
  // 環境変数のチェック
  checkEnvVars(process.env)

  registerSlashCommands({
    applicationId: process.env.APP_ID,
    botToken: process.env.DISCORD_TOKEN,
  })

  // クライアントを設定して起動
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  })

  client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`)
  })

  client.on(Events.Error, m => console.log('debug', new Error(m.message).stack))
  client.on(ShardEvents.Reconnecting, m => console.log('reconnecting', m))

  client.on(Events.InteractionCreate, onInteractionCreate)
  client.on(Events.MessageCreate, onMessageCreate)

  client.login(process.env.DISCORD_TOKEN)
}

main()

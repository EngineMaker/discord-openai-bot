import {
  ChannelType,
  Client,
  Events,
  GatewayIntentBits,
  Interaction,
  Message,
  REST,
  Routes,
} from 'discord.js'
import { Configuration, OpenAIApi } from 'openai'

import dotenv from 'dotenv'
import { cheefulPrompt } from './prompt/cheerful'
import { basicPrompt } from './prompt/basic'
dotenv.config()

const main = () => {
  // 環境変数のチェック
  const envNames = [
    'DISCORD_TOKEN',
    'APP_ID',
    'OPENAI_API_KEY',
    'TARGET_CHANNEL_ID',
    'TARGET_CHANNEL_ID_CHEEFUL',
  ]

  envNames.forEach((name: string) => {
    if (!process.env[name]) console.error(`${name} is not set!`)
  })

  // for ts
  if (!process.env.DISCORD_TOKEN) return
  if (!process.env.APP_ID) return
  if (!process.env.OPENAI_API_KEY) return
  if (!process.env.TARGET_CHANNEL_ID) return
  if (!process.env.TARGET_CHANNEL_ID_CHEEFUL) return

  // discordサーバーにコマンドを登録（今は使ってないですが……）
  const commands = [
    {
      name: 'ping',
      description: 'Replies with Pong!!!',
    },
    {
      name: 'start-chat',
      description: 'スレッドを作成してGPTとのチャットを開始します...',
    },
  ]

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN)
  rest.put(Routes.applicationCommands(process.env.APP_ID), {
    body: commands,
  })

  // クライアントを設定して起動
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  })

  client.on('error', m => console.log('debug', new Error(m.message).stack))
  client.on('reconnecting', m => console.log('reconnecting', m))

  client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`)
  })

  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return

    if (interaction.commandName === 'ping') {
      await interaction.reply('Pong!')
    }
  })

  client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot) return
    if (
      message.channel.id !== process.env.TARGET_CHANNEL_ID &&
      message.channel.id !== process.env.TARGET_CHANNEL_ID_CHEEFUL
    )
      return

    if (message.channel?.type === ChannelType.GuildText) {
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      })
      const openai = new OpenAIApi(configuration)
      const prompt =
        message.channel.id === process.env.TARGET_CHANNEL_ID_CHEEFUL
          ? cheefulPrompt
          : basicPrompt
      message.channel.sendTyping()
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: prompt(message),
        temperature: 0.7,
      })
      message.channel.send(
        response.data.choices[0].message?.content || 'error!'
      )
    }
  })

  client.login(process.env.DISCORD_TOKEN)
}

main()

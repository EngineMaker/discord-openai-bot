import { ChannelType, Interaction, Message, MessageType } from 'discord.js'
import {
  OpenAIApi,
  Configuration,
  ChatCompletionRequestMessage,
  CreateChatCompletionResponse,
} from 'openai'
import { basicPrompt } from '../prompt/basic'
import { cheefulPrompt } from '../prompt/cheerful'
import { unknownPrompt } from '../prompt/unknown'
import { oldPersonPrompt } from '../prompt/old'
import { passionPrompt } from '../prompt/passion'

export type Context = ChatCompletionRequestMessage[]
const userContext: { [key: string]: Context } = {}
const channelContext: { [key: string]: Context } = {}

export const onInteractionCreate = async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!')
  }

  if (interaction.commandName === 'prompt') {
    await interaction.reply(
      `\`\`\`json
${JSON.stringify(userContext[interaction.user.id], null, 2)}
\`\`\``
    )
  }

  if (interaction.commandName === 'prompt-clear') {
    userContext[interaction.user.id] = []
    await interaction.reply('会話履歴を消去しました。')
  }
}

const callChatAPI = async (
  message: Message,
  context: Context
): Promise<
  import('axios').AxiosResponse<CreateChatCompletionResponse, any>
> => {
  const prompt =
    message.channel.id === process.env.TARGET_CHANNEL_ID_CHEEFUL
      ? cheefulPrompt
      : message.channel.id === process.env.TARGET_CHANNEL_ID_UNKNOWN
      ? unknownPrompt
      : message.channel.id === process.env.TARGET_CHANNEL_ID_OLD
      ? oldPersonPrompt
      : message.channel.id === process.env.TARGET_CHANNEL_ID_PASSION
      ? passionPrompt
      : basicPrompt

  const openai = new OpenAIApi(
    new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    })
  )

  try {
    return await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: prompt(message, context),
      temperature: 0.7,
    })
  } catch (e) {
    if (context.every(c => c.role === 'system')) throw e

    // いっぱいになったら半分消す
    const shrinked = context
      .filter(c_2 => c_2.role !== 'system')
      .slice(context.length / 2)

    channelContext[message.channel.id] = shrinked
    return await callChatAPI(message, shrinked)
  }
}

export const onMessageCreate = async (message: Message) => {
  if (message.author.bot) return
  if (message.type === MessageType.Reply) return
  if (
    message.channel.id !== process.env.TARGET_CHANNEL_ID &&
    message.channel.id !== process.env.TARGET_CHANNEL_ID_CHEEFUL &&
    message.channel.id !== process.env.TARGET_CHANNEL_ID_UNKNOWN &&
    message.channel.id !== process.env.TARGET_CHANNEL_ID_OLD &&
    message.channel.id !== process.env.TARGET_CHANNEL_ID_PASSION
  )
    return

  if (message.channel.type === ChannelType.GuildText) {
    message.channel.sendTyping()
    const response = await callChatAPI(
      message,
      channelContext[message.channel.id]
    )
    const answer = response?.data.choices[0].message?.content

    if (!userContext[message.author.id]) {
      userContext[message.author.id] = []
    }
    userContext[message.author.id].push(
      { role: 'user', content: message.content },
      {
        role: 'assistant',
        content: answer || '',
      }
    )

    if (!channelContext[message.channel.id]) {
      channelContext[message.channel.id] = []
    }
    channelContext[message.channel.id].push(
      { role: 'user', content: message.content },
      {
        role: 'assistant',
        content: answer || '',
      }
    )

    message.channel.send(answer || 'error!')
  }
}

import { ChannelType, Interaction, Message } from 'discord.js'
import {
  OpenAIApi,
  Configuration,
  ChatCompletionRequestMessage,
  CreateChatCompletionResponse,
} from 'openai'
import { basicPrompt } from '../prompt/basic'
import { cheefulPrompt } from '../prompt/cheerful'

export type Context = ChatCompletionRequestMessage[]
const userContext: { [key: string]: Context } = {}
const channelContext: { [key: string]: Context } = {}

export const onInteractionCreate = async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!')
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
      : basicPrompt

  const openai = new OpenAIApi(
    new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    })
  )

  try {
    // console.log(prompt(message, context))
    return await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: prompt(message, context),
      temperature: 0.7,
    })
  } catch (e) {
    if (context.every(c => c.role === 'system')) throw e

    // いっぱいになったら半分消す
    const shrinked = [
      ...context.filter(c_1 => c_1.role === 'system'),
      ...context.filter(c_2 => c_2.role !== 'system').slice(context.length / 2),
    ]
    channelContext[message.channel.id] = shrinked
    // console.log('messages shrinked!', shrinked.length)
    return await callChatAPI(message, shrinked)
  }
}

export const onMessageCreate = async (message: Message) => {
  if (message.author.bot) return
  if (
    message.channel.id !== process.env.TARGET_CHANNEL_ID &&
    message.channel.id !== process.env.TARGET_CHANNEL_ID_CHEEFUL
  )
    return

  // console.log(channelContext[message.channel.id]?.length)

  if (message.channel.type === ChannelType.GuildText) {
    message.channel.sendTyping()
    const response = await callChatAPI(
      message,
      channelContext[message.channel.id]
    )

    // console.log(response?.data)

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

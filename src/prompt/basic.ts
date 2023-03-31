import { Message } from 'discord.js'
import { ChatCompletionRequestMessage } from 'openai'
import { Context } from '../discord/events'

export const basicPrompt = (
  message: Message,
  context: Context = []
): ChatCompletionRequestMessage[] => [
  ...context,
  { role: 'user', content: message.content },
]

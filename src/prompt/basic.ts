import { Message } from 'discord.js'
import { ChatCompletionRequestMessage } from 'openai'

export const basicPrompt = (
  message: Message
): ChatCompletionRequestMessage[] => [
  { role: 'user', content: message.content },
]

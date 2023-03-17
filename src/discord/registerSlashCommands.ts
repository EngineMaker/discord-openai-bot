import { REST, Routes } from 'discord.js'

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

interface DiscordApiKey {
  applicationId: string
  botToken: string
}

type RegisterSlashCommands = (apiKeys: DiscordApiKey) => void

export const registerSlashCommands: RegisterSlashCommands = ({
  applicationId,
  botToken,
}) => {
  const rest = new REST({ version: '10' }).setToken(applicationId)
  rest.put(Routes.applicationCommands(botToken), {
    body: commands,
  })
}

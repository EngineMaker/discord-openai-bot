import {
  REST,
  Routes,
  SharedSlashCommandOptions,
  SlashCommandStringOption,
} from 'discord.js'

// discordサーバーにコマンドを登録（今は使ってないですが……）
const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!!!',
  },
  {
    name: 'prompt',
    description: '現時点の会話履歴を表示します',
  },
  {
    name: 'prompt-clear',
    description: '会話履歴を消去します',
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
  const rest = new REST({ version: '10' }).setToken(botToken)
  rest.put(Routes.applicationCommands(applicationId), {
    body: commands,
  })
}

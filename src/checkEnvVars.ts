const envNames = [
  'DISCORD_TOKEN',
  'APP_ID',
  'OPENAI_API_KEY',
  'TARGET_CHANNEL_ID',
  'TARGET_CHANNEL_ID_CHEEFUL',
] as const

export const checkEnvVars = (processEnv: NodeJS.ProcessEnv) => {
  envNames.forEach(name => {
    if (!processEnv[name]) throw new Error(`${name} is not set!`)
  })
}

declare namespace NodeJS {
  export interface ProcessEnv {
    DISCORD_TOKEN?: string
    APP_ID?: string
    OPENAI_API_KEY?: string
    TARGET_CHANNEL_ID?: string
  }
}

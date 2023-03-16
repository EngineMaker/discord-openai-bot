// 今は使ってないけど将来のために……

// import {
//   ChatInputCommandInteraction,
//   CommandInteraction,
//   SlashCommandBuilder,
// } from 'discord.js'

// const data = new SlashCommandBuilder()
//   .setName('user')
//   .setDescription('Provides information about the user.')

// const execute = async (interaction: ChatInputCommandInteraction) => {
//   const member = interaction.inCachedGuild() ? interaction.member : null
//   await interaction.reply(
//     `This command was run by ${member?.user.username}, who joined on ${member?.joinedAt}.`
//   )
// }

import { CommandInteraction, SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Responde com Pong!");

async function execute(interaction: CommandInteraction) {
  await interaction.reply("Pong!");
}

export { data, execute };

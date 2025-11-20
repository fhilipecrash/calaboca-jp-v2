import { CommandInteraction, SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("skip")
  .setDescription("Pula a música atual");

async function execute(interaction: CommandInteraction) {
  const player = interaction.client.kazagumo.players.get(interaction.guildId!);
  if (!player) return interaction.reply("Nenhum player ativo neste servidor.");
  player.skip();
  return interaction.reply({
    content: `Pulou para a música **${player.queue[0]?.title}** de **${player.queue[0]?.author}**`
  });
}

export { data, execute };

import { CommandInteraction, SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("stop")
  .setDescription("Para a música atual e limpa a fila");

async function execute(interaction: CommandInteraction) {
  const player = interaction.client.kazagumo.players.get(interaction.guildId!);
  if (!player) return interaction.reply("Nenhum player ativo neste servidor.");
  player.queue.clear();
  return interaction.reply({
    content: `A música foi parada e a fila foi limpa.`
  });
}

export { data, execute };

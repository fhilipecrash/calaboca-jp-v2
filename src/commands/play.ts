import { SlashCommandBuilder } from "discord.js";
import { GuildMember, ChatInputCommandInteraction } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Toca música")
  .addStringOption(option => 
    option.setName('query')
        .setDescription('Coloque o nome ou link da música que deseja tocar')
        .setRequired(true));

async function execute(interaction: ChatInputCommandInteraction) {
  const member = interaction.member as GuildMember | null;
  if (!member || !member.voice.channel) {
    return interaction.reply('Você não está conectado a um canal de voz!');
  }

  const query = interaction.options.get('query')?.value as string | null;
  if (!query) {
    return interaction.reply('Nenhuma consulta fornecida!');
  }

  const player = await interaction.client.kazagumo.createPlayer({
    guildId: interaction.guildId!,
    voiceId: member.voice.channel.id,
    textId: interaction.channelId,
    volume: 40
  })

  const result = await interaction.client.kazagumo.search(query, {requester: interaction.user});
  if (!result.tracks.length) return interaction.reply("Nenhum resultado encontrado!");

  if (result.type === "PLAYLIST") player.queue.add(result.tracks);
        else player.queue.add(result.tracks[0]);

  if (!player.playing && !player.paused) player.play();
    return await interaction.reply({
      content: result.type === "PLAYLIST"
        ? `Adicionado na fila ${result.tracks.length} de ${result.playlistName}`
        : `Adicionado na fila ${result.tracks[0].title}`
    });
}

export { data, execute };

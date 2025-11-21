import {
  Client,
  GatewayIntentBits,
  Events,
  Collection,
  MessageFlags,
  TextChannel
} from "discord.js";
import { Connectors } from "shoukaku";
import { config } from "./config";
import { deployCommands } from "./deploy-commands";
import { Kazagumo } from "kazagumo";

const Nodes = [{
  name: "Localhost",
  url: "localhost:2333",
  auth: "youshallnotpass",
}];

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
const kazagumo = new Kazagumo({
  defaultSearchEngine: "youtube",
  send: (guildId, payload) => {
    const guild = client.guilds.cache.get(guildId);
    if (guild) guild.shard.send(payload);
  }
}, new Connectors.DiscordJS(client), Nodes);

async function startBot() {
  client.commands = new Collection();
  client.kazagumo = kazagumo;

  kazagumo.shoukaku.on('ready', (name) => console.log(`Lavalink ${name}: Ready!`));
  kazagumo.shoukaku.on('error', (name, error) => console.error(`Lavalink ${name}: Error Caught,`, error));
  kazagumo.shoukaku.on('close', (name, code, reason) => console.warn(`Lavalink ${name}: Closed, Code ${code}, Reason ${reason || 'No reason'}`));
  kazagumo.shoukaku.on('debug', (name, info) => console.debug(`Lavalink ${name}: Debug,`, info));
  kazagumo.shoukaku.on('disconnect', (name, count) => {
    const players = [...kazagumo.shoukaku.players.values()].filter(p => p.node.name === name);
    players.map(player => {
      kazagumo.destroyPlayer(player.guildId);
      player.destroy();
    });
    console.warn(`Lavalink ${name}: Disconnected`);
  });

  kazagumo.on("playerStart", (player, track) => {
    (client.channels.cache.get(player.textId!) as TextChannel)?.send({content: `Tocando **${track.title}** por **${track.author}**`})
      .then(x => player.data.set("message", x));
  });

  kazagumo.on("playerEnd", (player) => {
    player.data.get("message")?.edit({content: 'Playlist acabou ou nenhum outra música na fila.'});
  });

  kazagumo.on("playerEmpty", (player) => {
    (client.channels.cache.get(player.textId!) as TextChannel)?.send({content: 'O canal de voz está vazio. Saindo...'})
      .then(x => player.data.set("message", x));
    player.destroy();
  });

  client.once(Events.ClientReady, async (readyClient) => {
    console.log(`Pronto! Logado como ${readyClient.user.tag}`);
    const guilds = client.guilds.cache.map(guild => guild.id);
    for (const guildId of guilds) {
      await deployCommands({ guildId: guildId, commandCollection: client.commands });
    }
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`Nenhum comando correspondente a ${interaction.commandName} foi encontrado.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'Ocorreu um erro ao executar este comando!',
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: 'Ocorreu um erro ao executar este comando!',
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  });

  client.login(config.DISCORD_TOKEN);
}

startBot().catch(console.error);

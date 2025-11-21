import { REST, Routes } from "discord.js";
import type { Collection } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST().setToken(config.DISCORD_TOKEN);

type DeployCommandsProps = {
  guildId: string;
  commandCollection?: Collection<string, any>;
};

export async function deployCommands({ guildId, commandCollection }: DeployCommandsProps) {
  try {
    if (commandCollection) {
      for (const commandName in commands) {
        const command = commands[commandName as keyof typeof commands];
        commandCollection.set(command.data.name, command);
      }
    }
    console.log("Atualizando comandos (/)...");

    await rest.put(
      Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildId),
      {
        body: commandsData,
      }
    );

    console.log("Comandos (/) da aplicação recarregados com sucesso.");
  } catch (error) {
    console.error(error);
  }
}

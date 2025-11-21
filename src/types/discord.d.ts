import { Collection } from "discord.js";
import { Kazagumo } from "kazagumo";

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, any>;
    kazagumo: Kazagumo;
  }
}

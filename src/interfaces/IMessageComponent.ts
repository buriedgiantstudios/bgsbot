import * as Discord from "discord.js";

// components are created once, and then used multiple times as needed to build for messages.
export interface IMessageComponent<T extends Discord.MessageComponentType> {
  id: string;
  build: (...args: Array<any>) => Discord.MappedComponentTypes[T];
  execute: (interaction: Discord.MappedInteractionTypes[T]) => Promise<void>;
}

import * as Discord from "discord.js";

// commands are created once, and then run multiple times as needed.
export interface ICommand {
  data: Discord.SlashCommandOptionsOnlyBuilder;
  execute: (interaction: Discord.ChatInputCommandInteraction) => Promise<void>;
  autocomplete?: (interaction: Discord.AutocompleteInteraction) => Promise<void>;
}

import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  MessageActionRowComponentBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { Inject } from "typescript-ioc";
import { ICommand } from "../interfaces";
import { CardService } from "../services/card";
import { PresenceService } from "../services/presence";
import { EmbedService } from "../services/embed";
import { CardSelect } from "../components";

export class CardCommand implements ICommand {
  @Inject private cardService: CardService;
  @Inject private embedService: EmbedService;
  @Inject private presence: PresenceService;

  @Inject private cardSelect: CardSelect;

  data = new SlashCommandBuilder()
    .setName("card")
    .setDescription(
      "Retrieve card data for any card in the Buried Giant Studios catalog."
    )
    .addStringOption((option) =>
      option
        .setName("cardname")
        .setDescription("The name of the card to search for.")
        .setRequired(true)
    );

  public async execute(interaction: ChatInputCommandInteraction) {
    const cardName = interaction.options.get("cardname")!.value as string;
    const cardsData = this.cardService.getCards(cardName);
    if (!cardsData) {
      await interaction.reply(
        `Could not find a card with a name or id like "${cardName}".`
      );
      return;
    }

    const mainCardData = cardsData[0];
    const faqData = this.cardService.getFAQsForCard(
      mainCardData.game,
      mainCardData.name
    );
    const errataData = this.cardService.getErratasForCard(
      mainCardData.game,
      mainCardData.name
    );

    const embed = this.embedService.getCardEmbed(mainCardData, faqData, errataData);
    const components = cardsData.length > 1
      ? [new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(this.cardSelect.build(cardsData))]
      : undefined;
    await interaction.reply({ embeds: [embed], components: components });
    this.presence.setPresence(`with ${mainCardData.name}`);
  }
}

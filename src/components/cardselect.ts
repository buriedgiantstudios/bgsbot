import { ActionRowBuilder, Collection, ComponentType, MessageActionRowComponentBuilder, MessageComponentBuilder, MessageFlags, StringSelectMenuBuilder, StringSelectMenuComponent, StringSelectMenuInteraction, StringSelectMenuOptionBuilder } from "discord.js";
import { Inject, OnlyInstantiableByContainer, Singleton } from "typescript-ioc";
import { CardService } from "../services/card";
import { EmbedService } from "../services/embed";
import { BaseMessageComponent } from "../base/BaseMessageComponent";
import { ICard } from "../interfaces/ICard";
import { ellipsize } from "../utils";
import { PresenceService } from "../services/presence";

@Singleton
@OnlyInstantiableByContainer
export class CardSelect extends BaseMessageComponent<ComponentType.StringSelect> {
  @Inject private cardService: CardService;
  @Inject private embedService: EmbedService;
  @Inject private presence: PresenceService;

  private cardRequestCache = new Collection<string, Array<ICard>>();

  id = "card-select";

  public build(data: string | Array<ICard>) {
    let id: string;
    if (typeof data === "string") {
      id = data;
      data = this.cardRequestCache.get(data)!;
    } else {
      id = this.generateId()
      data = data.slice(0, 25);
      this.cardRequestCache.set(id, data);
      if (this.cardRequestCache.size > 100) {
        this.cardRequestCache.delete(this.cardRequestCache.firstKey()!)
      }
    }

    return new StringSelectMenuBuilder()
      .setPlaceholder("View similar card...")
      .setOptions(data.map((e, i) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(`${ellipsize(e.name, 97 - e.id.length)} (${e.id})`)
          .setDescription(ellipsize(e.text))
          .setValue(i.toString())
      ))
      .setCustomId(id)
  }

  public async execute(interaction: StringSelectMenuInteraction) {
    const cardsData = this.cardRequestCache.get(interaction.customId);
    if (!cardsData) {
      await interaction.reply({
        content: `Cache has expired for this component.`,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const mainCardData = cardsData[Number.parseInt(interaction.values[0])];
    const faqData = this.cardService.getFAQsForCard(
      mainCardData.game,
      mainCardData.name
    );
    const errataData = this.cardService.getErratasForCard(
      mainCardData.game,
      mainCardData.name
    );

    const embed = this.embedService.getCardEmbed(mainCardData, faqData, errataData);
    const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(this.build(interaction.customId));
    await interaction.update({ embeds: [embed], components: [actionRow] });
    this.presence.setPresence(`with ${mainCardData.name}`);
  }
}
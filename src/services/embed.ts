import { Singleton, OnlyInstantiableByContainer, Inject } from "typescript-ioc";
import * as Discord from "discord.js";
import { BaseService } from "../base/BaseService";
import { ICard } from "../interfaces/ICard";
import { EmojiService } from "./emoji";

@Singleton
@OnlyInstantiableByContainer
export class EmbedService extends BaseService {
  @Inject private emojiService: EmojiService;

  public async init(client: Discord.Client) {
    super.init(client);
  }

  public getCardEmbed(cardData: ICard, faqData: Array<{ q: string, a: string }>, errataData: Array<{ text: string }>) {
    const embed = new Discord.EmbedBuilder()
      .setTitle(cardData.name)
      .setURL(`https://cards.buriedgiantstudios.com/card/${cardData.id}`)
      .setFooter({
        text: `${cardData.id} - ${faqData.length} FAQ | ${errataData.length} Errata`,
      })
      .setThumbnail(cardData.image);

    const text = this.emojiService.replaceTagsWithEmojis(cardData.text);
    if (text) {
      embed.setDescription(text);
    }
    return embed
  }
}
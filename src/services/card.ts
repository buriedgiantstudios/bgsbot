import * as fs from "fs-extra";
import FuzzySet from "fuzzyset.js";
import { OnlyInstantiableByContainer, Singleton } from "typescript-ioc";

import { BaseService } from "../base/BaseService";
import * as Discord from "discord.js";
import { ICard } from "../interfaces/ICard";

@Singleton
@OnlyInstantiableByContainer
export class CardService extends BaseService {
  private cardsByName: { [key: string]: ICard } = {};
  private set: FuzzySet = FuzzySet();

  private faq: Record<
    string,
    Record<
      string,
      Array<{ faq: Array<{ q: string; a: string }>; card: string }>
    >
  > = {};
  private errata: Record<
    string,
    Record<string, Array<{ errata: Array<{ text: string }>; card: string }>>
  > = {};

  public async init(client: Discord.Client) {
    super.init(client);

    this.loadCards();

    this.faq = fs.readJsonSync("./content/data/faq.json");
    this.errata = fs.readJsonSync("./content/data/errata.json");
  }

  public getCard(name: string) {
    const res = this.set.get(name.toLowerCase());
    if (!res) {
      return null;
    }

    return this.cardsByName[res[0][1]];
  }

  public getCards(name: string) {
    const res = this.set.get(name.toLowerCase());
    if (!res) {
      return null;
    }

    return res.map((e) => this.cardsByName[e[1]]);
  }

  public getFAQsForCard(product: string, cardName: string) {
    const faqData = this.faq[product]?.["en-US"]?.find(
      (e) => e.card === cardName
    );
    return faqData?.faq ?? [];
  }

  public getErratasForCard(product: string, cardName: string) {
    const errataData = this.errata[product]?.["en-US"]?.find(
      (e) => e.card === cardName
    );
    return errataData?.errata ?? [];
  }

  private loadCards() {
    const cards = fs.readJsonSync("./content/data/cards.json");

    cards.forEach((card: ICard) => {
      this.cardsByName[(card.name + card.id).toLowerCase()] = card;
      this.cardsByName[card.id.toLowerCase()] = card;
      this.set.add((card.name + card.id).toLowerCase());
      this.set.add(card.id.toLowerCase());
    });
  }
}

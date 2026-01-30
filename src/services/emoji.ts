
import * as Discord from 'discord.js';

import { AutoWired, Singleton } from 'typescript-ioc';
import { BaseService } from '../base/BaseService';

@Singleton
@AutoWired
export class EmojiService extends BaseService {
  private emojiHash: { [key: string]: string } = {};
  private emojiInstanceHash: { [key: string]: Discord.Emoji } = {};

  public async init(client) {
    super.init(client);
    await this.loadEmojis();
  }

  public getEmoji(name: string) {
    return this.emojiHash[name];
  }

  public getEmojiInstance(name: string) {
    return this.emojiInstanceHash[name];
  }

  public replaceTagsWithEmojis(text: string) {
    let match: RegExpMatchArray | null = null;

    // tslint:disable-next-line:no-conditional-assignment
    while ((match = text.match(/`([a-z\-_]+):([a-z\-_]+)(?::([0-9.]+))?`/))) {
      const [replace, key, value, rule] = match;
      const emoji = this.getEmoji(`${key}_${value.replace(/-/g, "_")}`) ?? `${key}:${value}`;
      const replacement = rule ? `${emoji} (${rule})` : emoji;
      text = text.replace(replace, replacement);
    }

    return text;
  }

  private async loadEmojis() {
    (await this.client.application.emojis.fetch()).forEach((emoji) => {
      this.emojiHash[emoji.name] = emoji.toString();
      this.emojiInstanceHash[emoji.name] = emoji;
    });
  }
}

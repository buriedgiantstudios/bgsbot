import { MappedComponentTypes, MessageComponentType } from "discord.js";
import { IMessageComponent } from "../interfaces";
import * as Discord from "discord.js";
import { randomBytes } from "crypto";

export abstract class BaseMessageComponent<T extends MessageComponentType> implements IMessageComponent<T> {
	abstract id: string;
	abstract build(...args: Array<any>): MappedComponentTypes[T];
	abstract execute(interaction: Discord.MappedInteractionTypes[T]): Promise<void>;

	protected generateId() {
		return `${this.id}#${randomBytes(Math.floor((99 - this.id.length) / 2)).toString("hex")}`;
	}
}
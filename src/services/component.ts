import { Singleton, OnlyInstantiableByContainer, Inject } from "typescript-ioc";
import * as Discord from "discord.js";
import { BaseService } from "../base/BaseService";
import { replyOrFollowup } from "../utils";
import { CardSelect } from "../components";
import { BaseMessageComponent } from "../base/BaseMessageComponent";
import { IMessageComponent } from "../interfaces";
import { Logger } from "./logger";

@Singleton
@OnlyInstantiableByContainer
export class ComponentService extends BaseService {
	@Inject private logger: Logger;

	@Inject private cardSelect: CardSelect;
	components = new Discord.Collection<string, IMessageComponent<any>>();

	public async init(client: Discord.Client) {
		for (const key in this) {
			const component = this[key];
			if (!(component instanceof BaseMessageComponent)) {
				continue;
			}

			this.components.set(component.id, component);
			this.logger.log(`Initialized component ${key}`);
		}
	}

	public async handleInteraction(interaction: Discord.MessageComponentInteraction) {
		const component = this.components.get(interaction.customId.split("#")[0]);

		if (!component) {
			console.error(
			`No component matching ${interaction.customId} was found.`
			);
			return;
		}

		try {
			await component.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.isRepliable()) {
				await replyOrFollowup(interaction, {
					content: "There was an error while executing this component!",
					ephemeral: true,
				});
			}
		}
	}
}
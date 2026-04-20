import { InteractionReplyOptions, MessagePayload, RepliableInteraction } from "discord.js";

export async function replyOrFollowup(interaction: RepliableInteraction, data: string | MessagePayload | InteractionReplyOptions) {
	if (interaction.replied || interaction.deferred) {
		await interaction.followUp(data);
	} else {
		await interaction.reply(data);
	}
}

export function ellipsize(text: string, maxLength: number = 100) {
	if (text.length <= maxLength) {
		return text;
	} else {
		return text.slice(0, maxLength - 3) + "...";
	}
}
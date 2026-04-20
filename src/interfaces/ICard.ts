export interface ICard {
	id: string;
	text: string;
	image: string;
	name: string;
	tags: Array<string>;
	meta: Record<string, number>,
	game: string;
	product: string;
	locale: string;
}
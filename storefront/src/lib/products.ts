export type Product = {
	id: string;
	title: string;
	price: number;
	image: string;
	category: string;
	badge?: string;
};

export const products: Product[] = [
	{
		id: "air-zoom-pegasus",
		title: "Air Zoom Pegasus 41",
		price: 1999000,
		image: "/window.svg",
		category: "running",
		badge: "Baru",
	},
	{
		id: "metcon-9",
		title: "Metcon 9",
		price: 2299000,
		image: "/window.svg",
		category: "training",
	},
	{
		id: "invincible-3",
		title: "Invincible 3",
		price: 2799000,
		image: "/window.svg",
		category: "running",
	},
	{
		id: "air-force-1",
		title: "Air Force 1 '07",
		price: 1699000,
		image: "/window.svg",
		category: "lifestyle",
		badge: "Best Seller",
	},
];

export function formatIDR(value: number): string {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		maximumFractionDigits: 0,
	}).format(value);
}



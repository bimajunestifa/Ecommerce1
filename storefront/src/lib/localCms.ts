import type { Product } from "@/lib/types";

const PRODUCTS_KEY = "bimastore:cms:products:v1";
const SETTINGS_KEY = "bimastore:cms:settings:v1";
const USERS_KEY = "bimastore:cms:users:v1";

export type CmsUser = { id: string; name: string; email: string; role: "admin" | "karyawan" | "user"; createdAt: string; active: boolean };

export type CmsSettings = {
	storeName: string;
	announcement: string;
	heroEyebrow: string;
	heroTitle: string;
	heroDescription: string;
	heroButton: string;
	voucherCode: string;
	voucherPercent: number;
	maxDiscount: number;
	maintenanceMode: boolean;
	codEnabled: boolean;
	eWalletEnabled: boolean;
};

export const defaultCmsSettings: CmsSettings = {
	storeName: "BimaStore",
	announcement: "Gratis ongkir untuk pilihan produk tertentu",
	heroEyebrow: "Koleksi Terbaru",
	heroTitle: "Lari Lebih Jauh, Nyaman Setiap Langkah",
	heroDescription: "Temukan sepatu lari, training, dan lifestyle dengan teknologi terbaru untuk performa terbaik.",
	heroButton: "Belanja Sekarang",
	voucherCode: "BIMA10",
	voucherPercent: 10,
	maxDiscount: 50000,
	maintenanceMode: false,
	codEnabled: true,
	eWalletEnabled: true,
};

export function getCmsProducts(): Product[] {
	if (typeof window === "undefined") return [];
	try {
		const value = localStorage.getItem(PRODUCTS_KEY);
		const products = value ? JSON.parse(value) : [];
		return Array.isArray(products) ? products : [];
	} catch { return []; }
}

export function initializeCmsProducts(seed: Product[]): Product[] {
	const current = getCmsProducts();
	if (current.length) return current;
	localStorage.setItem(PRODUCTS_KEY, JSON.stringify(seed));
	return seed;
}

export function saveCmsProducts(products: Product[]) {
	localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function upsertCmsProduct(product: Product) {
	const products = getCmsProducts();
	const index = products.findIndex((item) => item.id === product.id);
	if (index >= 0) products[index] = product;
	else products.unshift(product);
	saveCmsProducts(products);
	return product;
}

export function deleteCmsProduct(id: string) {
	saveCmsProducts(getCmsProducts().filter((product) => product.id !== id));
}

export function getCmsSettings(): CmsSettings {
	if (typeof window === "undefined") return defaultCmsSettings;
	try {
		const value = localStorage.getItem(SETTINGS_KEY);
		return value ? { ...defaultCmsSettings, ...JSON.parse(value) } : defaultCmsSettings;
	} catch { return defaultCmsSettings; }
}

export function saveCmsSettings(settings: CmsSettings) {
	localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getCmsUsers(): CmsUser[] {
	if (typeof window === "undefined") return [];
	try {
		const value = localStorage.getItem(USERS_KEY);
		if (value) return JSON.parse(value);
		const initial: CmsUser[] = [{ id: "admin-demo", name: "Administrator", email: "admin@bimastore.id", role: "admin", createdAt: new Date().toISOString(), active: true }];
		localStorage.setItem(USERS_KEY, JSON.stringify(initial));
		return initial;
	} catch { return []; }
}

export function saveCmsUsers(users: CmsUser[]) {
	localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function addCmsUser(user: CmsUser) {
	const users = getCmsUsers();
	if (users.some((item) => item.email.toLowerCase() === user.email.toLowerCase())) throw new Error("Email sudah digunakan");
	saveCmsUsers([user, ...users]);
}

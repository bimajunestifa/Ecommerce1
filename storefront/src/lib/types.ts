export type Product = {
	id: string;
	title: string;
	description?: string;
	price: number;
	originalPrice?: number;
	image: string;
	images?: string[];
	category: string;
	navCategory?: "pria" | "wanita" | "anak" | "sale" | ""; // Kategori navigasi (Pria, Wanita, Anak, Sale)
	badge?: string;
	stock: number;
	sold: number;
	rating: number;
	reviewCount: number;
	featured?: boolean; // Tampilkan di halaman beranda
	shop: {
		id: string;
		name: string;
		rating: number;
	};
	variants?: ProductVariant[];
};

export type ProductVariant = {
	id: string;
	name: string;
	options: string[];
};

export type User = {
	id: string;
	email: string;
	name: string;
	password: string;
	role: "user" | "admin" | "karyawan";
	avatar?: string;
	phone?: string;
	address?: Address[];
	wishlist?: string[];
	createdAt: string;
};

export type Address = {
	id: string;
	name: string;
	phone: string;
	address: string;
	city: string;
	postalCode: string;
	isDefault: boolean;
};

export type Review = {
	id: string;
	productId: string;
	userId: string;
	userName: string;
	userAvatar?: string;
	rating: number;
	comment: string;
	images?: string[];
	createdAt: string;
};

export type TrackingHistory = {
	status: string;
	message: string;
	location?: string;
	timestamp: string;
};

export type Order = {
	id: string;
	userId: string;
	items: OrderItem[];
	total: number;
	status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
	shippingAddress: Address;
	paymentMethod: string;
	trackingNumber?: string;
	trackingHistory?: TrackingHistory[];
	estimatedDelivery?: string;
	courier?: string;
	createdAt: string;
	updatedAt: string;
};

export type OrderItem = {
	productId: string;
	title: string;
	image: string;
	price: number;
	quantity: number;
};



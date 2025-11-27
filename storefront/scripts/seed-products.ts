// Script untuk menambahkan produk sample
// Jalankan dengan: npx tsx scripts/seed-products.ts

import { readProducts, writeProducts } from "../src/lib/db";
import { Product } from "../src/lib/types";
import crypto from "crypto";

const sampleProducts: Omit<Product, "id">[] = [
	{
		title: "Sepatu Running Nike Air Zoom Pegasus 41",
		description: "Sepatu running dengan teknologi Zoom Air untuk kenyamanan maksimal. Cocok untuk lari jarak jauh dan latihan sehari-hari.",
		price: 1999000,
		originalPrice: 2299000,
		image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
		images: [
			"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
			"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
		],
		category: "running",
		badge: "Baru",
		stock: 50,
		sold: 120,
		rating: 4.5,
		reviewCount: 45,
		shop: {
			id: "shop-1",
			name: "Bima Store",
			rating: 4.8,
		},
	},
	{
		title: "Sepatu Training Nike Metcon 9",
		description: "Sepatu training yang dirancang untuk crossfit dan latihan intensif. Tahan lama dengan grip yang kuat.",
		price: 2299000,
		image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500",
		images: [
			"https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500",
		],
		category: "training",
		badge: "Best Seller",
		stock: 30,
		sold: 250,
		rating: 4.7,
		reviewCount: 89,
		shop: {
			id: "shop-1",
			name: "Bima Store",
			rating: 4.8,
		},
	},
	{
		title: "Sepatu Lifestyle Nike Air Force 1 '07",
		description: "Sepatu klasik yang timeless. Cocok untuk gaya kasual sehari-hari dengan kenyamanan maksimal.",
		price: 1699000,
		originalPrice: 1999000,
		image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500",
		images: [
			"https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500",
		],
		category: "lifestyle",
		stock: 75,
		sold: 500,
		rating: 4.6,
		reviewCount: 156,
		shop: {
			id: "shop-1",
			name: "Bima Store",
			rating: 4.8,
		},
	},
	{
		title: "Sepatu Running Nike Invincible 3",
		description: "Sepatu running premium dengan teknologi ZoomX untuk responsivitas maksimal. Ideal untuk pelari serius.",
		price: 2799000,
		image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
		images: [
			"https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
		],
		category: "running",
		stock: 20,
		sold: 80,
		rating: 4.8,
		reviewCount: 34,
		shop: {
			id: "shop-1",
			name: "Bima Store",
			rating: 4.8,
		},
	},
	{
		title: "Sepatu Basketball Nike LeBron 21",
		description: "Sepatu basket dengan teknologi terbaru untuk performa maksimal di lapangan. Didesain untuk atlet profesional.",
		price: 2499000,
		originalPrice: 2999000,
		image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500",
		images: [
			"https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500",
		],
		category: "basketball",
		badge: "Sale",
		stock: 15,
		sold: 45,
		rating: 4.9,
		reviewCount: 23,
		shop: {
			id: "shop-1",
			name: "Bima Store",
			rating: 4.8,
		},
	},
	{
		title: "Sepatu Running Adidas Ultraboost 23",
		description: "Sepatu running dengan teknologi Boost untuk energi maksimal. Cocok untuk lari jarak jauh.",
		price: 2199000,
		image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500",
		images: [
			"https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500",
		],
		category: "running",
		stock: 40,
		sold: 180,
		rating: 4.6,
		reviewCount: 67,
		shop: {
			id: "shop-1",
			name: "Bima Store",
			rating: 4.8,
		},
	},
	{
		title: "Sepatu Skateboard Vans Old Skool",
		description: "Sepatu skateboard klasik yang ikonik. Tahan lama dan nyaman untuk aktivitas sehari-hari.",
		price: 899000,
		originalPrice: 1199000,
		image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500",
		images: [
			"https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500",
		],
		category: "lifestyle",
		badge: "Sale",
		stock: 60,
		sold: 320,
		rating: 4.5,
		reviewCount: 98,
		shop: {
			id: "shop-1",
			name: "Bima Store",
			rating: 4.8,
		},
	},
	{
		title: "Sepatu Running New Balance 1080v13",
		description: "Sepatu running dengan teknologi Fresh Foam untuk kenyamanan maksimal. Ideal untuk pelari pemula hingga menengah.",
		price: 1899000,
		image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500",
		images: [
			"https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500",
		],
		category: "running",
		stock: 35,
		sold: 95,
		rating: 4.4,
		reviewCount: 42,
		shop: {
			id: "shop-1",
			name: "Bima Store",
			rating: 4.8,
		},
	},
];

const existingProducts = readProducts();
const newProducts = sampleProducts.map((p) => ({
	...p,
	id: crypto.randomUUID(),
}));

// Hanya tambahkan produk yang belum ada
const productsToAdd = newProducts.filter(
	(newP) => !existingProducts.some((existing) => existing.title === newP.title)
);

if (productsToAdd.length > 0) {
	writeProducts([...existingProducts, ...productsToAdd]);
	console.log(`✅ Menambahkan ${productsToAdd.length} produk baru`);
} else {
	console.log("ℹ️ Semua produk sudah ada");
}

import fs from "fs";
import path from "path";
import { Product, User, Order, Review } from "@/lib/types";
import crypto from "crypto";

const dataDir = path.join(process.cwd(), "data");
const productsPath = path.join(dataDir, "products.json");
const usersPath = path.join(dataDir, "users.json");
const ordersPath = path.join(dataDir, "orders.json");
const reviewsPath = path.join(dataDir, "reviews.json");

function ensureDataFile() {
	if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
	if (!fs.existsSync(productsPath)) {
		fs.writeFileSync(productsPath, JSON.stringify([], null, 2), "utf-8");
	}
	if (!fs.existsSync(usersPath)) {
		fs.writeFileSync(usersPath, JSON.stringify([], null, 2), "utf-8");
	}
	if (!fs.existsSync(ordersPath)) {
		fs.writeFileSync(ordersPath, JSON.stringify([], null, 2), "utf-8");
	}
	if (!fs.existsSync(reviewsPath)) {
		fs.writeFileSync(reviewsPath, JSON.stringify([], null, 2), "utf-8");
	}
}

// Products
export function readProducts(): Product[] {
	ensureDataFile();
	const raw = fs.readFileSync(productsPath, "utf-8");
	try {
		const parsed = JSON.parse(raw) as Product[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

export function writeProducts(products: Product[]) {
	ensureDataFile();
	fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), "utf-8");
}

export function findProduct(id: string): Product | undefined {
	return readProducts().find((p) => p.id === id);
}

// Users
export function readUsers(): User[] {
	ensureDataFile();
	const raw = fs.readFileSync(usersPath, "utf-8");
	try {
		const parsed = JSON.parse(raw) as User[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

export function writeUsers(users: User[]) {
	ensureDataFile();
	fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), "utf-8");
}

export function findUserByEmail(email: string): User | undefined {
	return readUsers().find((u) => u.email === email);
}

export function findUserById(id: string): User | undefined {
	return readUsers().find((u) => u.id === id);
}

export function createUser(userData: Omit<User, "id" | "createdAt">): User {
	const users = readUsers();
	const newUser: User = {
		...userData,
		id: crypto.randomUUID(),
		createdAt: new Date().toISOString(),
	};
	users.push(newUser);
	writeUsers(users);
	return newUser;
}

// Orders
export function readOrders(): Order[] {
	ensureDataFile();
	const raw = fs.readFileSync(ordersPath, "utf-8");
	try {
		const parsed = JSON.parse(raw) as Order[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

export function writeOrders(orders: Order[]) {
	ensureDataFile();
	fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2), "utf-8");
}

export function findOrderById(id: string): Order | undefined {
	return readOrders().find((o) => o.id === id);
}

export function findOrdersByUserId(userId: string): Order[] {
	return readOrders().filter((o) => o.userId === userId);
}

export function createOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Order {
	const orders = readOrders();
	const newOrder: Order = {
		...orderData,
		id: crypto.randomUUID(),
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};
	orders.push(newOrder);
	writeOrders(orders);
	return newOrder;
}

// Reviews
export function readReviews(): Review[] {
	ensureDataFile();
	const raw = fs.readFileSync(reviewsPath, "utf-8");
	try {
		const parsed = JSON.parse(raw) as Review[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

export function writeReviews(reviews: Review[]) {
	ensureDataFile();
	fs.writeFileSync(reviewsPath, JSON.stringify(reviews, null, 2), "utf-8");
}

export function findReviewsByProductId(productId: string): Review[] {
	return readReviews().filter((r) => r.productId === productId);
}

export function createReview(reviewData: Omit<Review, "id" | "createdAt">): Review {
	const reviews = readReviews();
	const newReview: Review = {
		...reviewData,
		id: crypto.randomUUID(),
		createdAt: new Date().toISOString(),
	};
	reviews.push(newReview);
	writeReviews(reviews);
	return newReview;
}



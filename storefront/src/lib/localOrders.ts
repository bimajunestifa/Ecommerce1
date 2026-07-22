import type { Order } from "@/lib/types";

const STORAGE_KEY = "bimastore:orders:v2";

export function getLocalOrders(): Order[] {
	if (typeof window === "undefined") return [];
	try {
		const value = window.localStorage.getItem(STORAGE_KEY);
		const orders = value ? JSON.parse(value) : [];
		return Array.isArray(orders) ? orders : [];
	} catch {
		return [];
	}
}

function saveLocalOrders(orders: Order[]) {
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function createLocalOrder(data: Omit<Order, "id" | "createdAt" | "updatedAt">): Order {
	const now = new Date();
	const estimate = new Date(now);
	estimate.setDate(estimate.getDate() + 3);
	const order: Order = {
		...data,
		id: `BMS-${now.getTime().toString().slice(-9)}`,
		createdAt: now.toISOString(),
		updatedAt: now.toISOString(),
		estimatedDelivery: data.estimatedDelivery || estimate.toISOString(),
	};
	saveLocalOrders([order, ...getLocalOrders()]);
	return order;
}

export function getLocalOrder(id: string): Order | undefined {
	return getLocalOrders().find((order) => order.id === id);
}

export function updateLocalOrder(id: string, updates: Partial<Order>): Order | undefined {
	let updated: Order | undefined;
	const orders = getLocalOrders().map((order) => {
		if (order.id !== id) return order;
		updated = { ...order, ...updates, updatedAt: new Date().toISOString() };
		return updated;
	});
	saveLocalOrders(orders);
	return updated;
}

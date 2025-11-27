"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = { id: string; title: string; price: number; image: string; qty: number };

type CartState = {
	items: CartItem[];
	add: (item: Omit<CartItem, "qty">, qty?: number) => void;
	remove: (id: string) => void;
	setQty: (id: string, qty: number) => void;
	clear: () => void;
	total: number;
};

const CartCtx = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [items, setItems] = useState<CartItem[]>([]);

	useEffect(() => {
		try {
			const raw = localStorage.getItem("cart:v1");
			if (raw) setItems(JSON.parse(raw));
		} catch {}
	}, []);

	useEffect(() => {
		try {
			localStorage.setItem("cart:v1", JSON.stringify(items));
		} catch {}
	}, [items]);

	const total = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);

	function add(item: Omit<CartItem, "qty">, qty = 1) {
		setItems((prev) => {
			const idx = prev.findIndex((p) => p.id === item.id);
			if (idx >= 0) {
				const next = [...prev];
				next[idx] = { ...next[idx], qty: next[idx].qty + qty };
				return next;
			}
			return [...prev, { ...item, qty }];
		});
	}

	function remove(id: string) {
		setItems((prev) => prev.filter((i) => i.id !== id));
	}

	function setQty(id: string, qty: number) {
		setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
	}

	function clear() {
		setItems([]);
	}

	return (
		<CartCtx.Provider value={{ items, add, remove, setQty, clear, total }}>{children}</CartCtx.Provider>
	);
}

export function useCart() {
	const ctx = useContext(CartCtx);
	if (!ctx) throw new Error("useCart must be used within CartProvider");
	return ctx;
}



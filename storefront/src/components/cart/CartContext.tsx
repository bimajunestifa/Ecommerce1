"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = { id: string; title: string; price: number; image: string; qty: number };

type CartState = {
	items: CartItem[];
	add: (item: Omit<CartItem, "qty">, qty?: number) => void;
	buyNow: (item: Omit<CartItem, "qty">, qty?: number) => void;
	remove: (id: string) => void;
	setQty: (id: string, qty: number) => void;
	clear: () => void;
	total: number;
};

const CartCtx = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [items, setItems] = useState<CartItem[]>([]);

	useEffect(() => {
		queueMicrotask(() => {
			try {
				const raw = localStorage.getItem("cart:v1");
				if (raw) setItems(JSON.parse(raw));
			} catch {}
		});
	}, []);

	function save(next: CartItem[]) {
		try { localStorage.setItem("cart:v1", JSON.stringify(next)); } catch {}
		return next;
	}

	const total = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);

	function add(item: Omit<CartItem, "qty">, qty = 1) {
		setItems((prev) => {
			const idx = prev.findIndex((p) => p.id === item.id);
			if (idx >= 0) {
				const next = [...prev];
				next[idx] = { ...next[idx], qty: next[idx].qty + qty };
				return save(next);
			}
			const next = [...prev, { ...item, qty }];
			return save(next);
		});
	}

	function buyNow(item: Omit<CartItem, "qty">, qty = 1) {
		const next = [{ ...item, qty }];
		save(next);
		setItems(next);
	}

	function remove(id: string) {
		setItems((prev) => save(prev.filter((i) => i.id !== id)));
	}

	function setQty(id: string, qty: number) {
		setItems((prev) => save(prev.map((i) => (i.id === id ? { ...i, qty } : i))));
	}

	function clear() {
		save([]);
		setItems([]);
	}

	return (
		<CartCtx.Provider value={{ items, add, buyNow, remove, setQty, clear, total }}>{children}</CartCtx.Provider>
	);
}

export function useCart() {
	const ctx = useContext(CartCtx);
	if (!ctx) throw new Error("useCart must be used within CartProvider");
	return ctx;
}



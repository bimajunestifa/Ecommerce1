"use client";
import { useState } from "react";
import { useCart } from "@/components/cart/CartContext";

export default function AddToCart({ product }: { product: { id: string; title: string; price: number; image: string } }) {
	const { add } = useCart();
	const [qty, setQty] = useState(1);
	return (
		<div className="flex items-center gap-3">
			<div className="flex items-center gap-2">
				<button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-8 w-8 rounded border text-lg font-bold leading-none dark:border-zinc-700">-</button>
				<input value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} className="h-8 w-12 rounded border px-2 text-center dark:border-zinc-700" />
				<button onClick={() => setQty((q) => q + 1)} className="h-8 w-8 rounded border text-lg font-bold leading-none dark:border-zinc-700">+</button>
			</div>
			<button onClick={() => add(product, qty)} className="flex-1 rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600">Tambah ke Keranjang</button>
		</div>
	);
}



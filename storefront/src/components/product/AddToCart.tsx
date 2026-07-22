"use client";

import { useCart } from "@/components/cart/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ProductForCart = {
	id: string;
	title: string;
	price: number;
	image: string;
	stock?: number;
	variants?: { id: string; name: string; options: string[] }[];
};

export default function AddToCart({ product }: { product: ProductForCart }) {
	const { add, buyNow } = useCart();
	const router = useRouter();
	const [qty, setQty] = useState(1);
	const variants = product.variants?.length
		? product.variants
		: [{ id: "size", name: "Ukuran", options: ["36", "37", "38", "39", "40", "41", "42", "43"] }];
	const [selected, setSelected] = useState<Record<string, string>>(() =>
		Object.fromEntries(variants.map((variant) => [variant.id, variant.options[0]])),
	);
	const [message, setMessage] = useState("");

	function makeCartProduct() {
		const variantText = variants.map((variant) => selected[variant.id]).filter(Boolean).join(" / ");
		return {
			id: product.id,
			title: variantText ? `${product.title} · ${variantText}` : product.title,
			price: product.price,
			image: product.image,
		};
	}

	function handleAdd() {
		add(makeCartProduct(), qty);
		setMessage("Produk berhasil ditambahkan ke keranjang");
	}

	function handleBuyNow() {
		buyNow(makeCartProduct(), qty);
		router.push("/checkout");
	}

	return (
		<div className="space-y-5">
			{variants.map((variant) => (
				<div key={variant.id}>
					<div className="mb-2 flex justify-between text-sm">
						<span className="font-semibold">Pilih {variant.name}</span>
						<span className="text-zinc-500">Pilihan: {selected[variant.id]}</span>
					</div>
					<div className="flex flex-wrap gap-2">
						{variant.options.map((option) => (
							<button type="button" key={option} onClick={() => setSelected((value) => ({ ...value, [variant.id]: option }))} className={`min-w-12 rounded-lg border px-3 py-2 text-sm transition ${selected[variant.id] === option ? "border-orange-500 bg-orange-50 font-semibold text-orange-600 dark:bg-orange-950/20" : "border-zinc-300 hover:border-zinc-500 dark:border-zinc-700"}`}>
								{option}
							</button>
						))}
					</div>
				</div>
			))}
			<div className="flex items-center justify-between">
				<span className="text-sm font-semibold">Jumlah</span>
				<div className="flex items-center overflow-hidden rounded-lg border dark:border-zinc-700">
					<button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-10 w-10 text-lg hover:bg-zinc-100 dark:hover:bg-zinc-900">−</button>
					<input inputMode="numeric" value={qty} onChange={(e) => setQty(Math.min(product.stock || 99, Math.max(1, Number(e.target.value) || 1)))} className="h-10 w-12 border-x text-center outline-none dark:border-zinc-700 dark:bg-black" />
					<button type="button" onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))} className="h-10 w-10 text-lg hover:bg-zinc-100 dark:hover:bg-zinc-900">+</button>
				</div>
			</div>
			{message && <p className="text-sm text-green-600">{message}</p>}
			<div className="grid grid-cols-2 gap-3">
				<button type="button" onClick={handleAdd} disabled={product.stock === 0} className="rounded-xl border border-orange-500 px-4 py-3 font-semibold text-orange-600 hover:bg-orange-50 disabled:opacity-50 dark:hover:bg-orange-950/20">+ Keranjang</button>
				<button type="button" onClick={handleBuyNow} disabled={product.stock === 0} className="rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 disabled:opacity-50">Beli Sekarang</button>
			</div>
		</div>
	);
}

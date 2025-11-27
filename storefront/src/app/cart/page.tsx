"use client";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";

export default function CartPage() {
	const { items, setQty, remove, total, clear } = useCart();
	return (
		<div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
			<h1 className="mb-6 text-2xl font-bold">Keranjang</h1>
			{items.length === 0 ? (
				<div className="rounded-lg border p-8 text-center dark:border-zinc-800">
					<p>Keranjang kosong.</p>
					<div className="mt-4">
						<Link href="/products" className="underline">Belanja sekarang</Link>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
					<div className="md:col-span-2 space-y-4">
						{items.map((i) => (
							<div key={i.id} className="flex items-center gap-4 rounded-lg border p-4 dark:border-zinc-800">
								<div className="h-20 w-20 rounded-lg border bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
									{i.image && (
										<img src={i.image} alt={i.title} className="h-full w-full rounded-lg object-cover" />
									)}
								</div>
								<div className="flex-1">
									<p className="font-medium">{i.title}</p>
									<p className="text-sm text-zinc-600 dark:text-zinc-400">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(i.price)}</p>
								</div>
								<div className="flex items-center gap-3">
									<input type="number" min={1} value={i.qty} onChange={(e) => setQty(i.id, Math.max(1, Number(e.target.value) || 1))} className="h-8 w-16 rounded border px-2 text-center dark:border-zinc-700 dark:bg-zinc-900" />
									<p className="w-32 text-right font-semibold">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(i.price * i.qty)}</p>
									<button onClick={() => remove(i.id)} className="rounded px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Hapus</button>
								</div>
							</div>
						))}
					</div>
					<div className="rounded-lg border p-6 dark:border-zinc-800">
						<h2 className="mb-4 text-lg font-semibold">Ringkasan</h2>
						<div className="mb-4 space-y-2">
							<div className="flex justify-between text-sm">
								<span>Subtotal</span>
								<span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(total)}</span>
							</div>
							<div className="flex justify-between text-sm">
								<span>Ongkir</span>
								<span>Gratis</span>
							</div>
							<div className="border-t border-zinc-200 pt-2 dark:border-zinc-800">
								<div className="flex justify-between font-semibold">
									<span>Total</span>
									<span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(total)}</span>
								</div>
							</div>
						</div>
						<Link href="/checkout" className="block w-full rounded-lg bg-orange-500 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-orange-600">Checkout</Link>
						<button onClick={clear} className="mt-3 w-full text-sm text-red-600 hover:underline">Kosongkan Keranjang</button>
					</div>
				</div>
			)}
		</div>
	);
}



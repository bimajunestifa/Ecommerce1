"use client";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { Modal } from "@/components/Modal";
import { useState } from "react";
import { BackButton } from "@/components/BackButton";

export default function CartPage() {
	const { items, setQty, remove, total, clear } = useCart();
	const [showClearModal, setShowClearModal] = useState(false);

	const handleClearCart = () => {
		clear();
		setShowClearModal(false);
	};

	return (
		<div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
			<div className="mb-6">
				<BackButton href="/products" label="Lanjut Belanja" />
			</div>
			<h1 className="mb-6 text-2xl font-bold">Keranjang</h1>
			{items.length === 0 ? (
				<div className="rounded-lg border border-zinc-200 p-16 text-center dark:border-zinc-800">
					<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
						<svg className="h-10 w-10 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
						</svg>
					</div>
					<h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Keranjang Anda Kosong</h3>
					<p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
						Mulai belanja dan tambahkan produk ke keranjang Anda
					</p>
					<Link 
						href="/products" 
						className="inline-block rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600"
					>
						Belanja Sekarang
					</Link>
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
						<Link href="/checkout" className="block w-full rounded-lg bg-orange-500 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-orange-600">
							Checkout
						</Link>
						<button 
							onClick={() => setShowClearModal(true)} 
							className="mt-3 w-full text-sm text-red-600 hover:underline"
						>
							Kosongkan Keranjang
						</button>
					</div>
				</div>
			)}

			{/* Clear Cart Confirmation Modal */}
			<Modal
				isOpen={showClearModal}
				onClose={() => setShowClearModal(false)}
				title="Kosongkan Keranjang"
				size="sm"
			>
				<div className="space-y-4">
					<p className="text-sm text-zinc-600 dark:text-zinc-400">
						Apakah Anda yakin ingin mengosongkan keranjang? Semua item akan dihapus.
					</p>
					<div className="flex justify-end gap-3">
						<button
							onClick={() => setShowClearModal(false)}
							className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
						>
							Batal
						</button>
						<button
							onClick={handleClearCart}
							className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
						>
							Ya, Kosongkan
						</button>
					</div>
				</div>
			</Modal>
		</div>
	);
}



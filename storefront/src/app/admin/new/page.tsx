"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageURLHelper from "@/components/ImageURLHelper";

export default function NewProduct() {
	const router = useRouter();
	const [form, setForm] = useState({ 
		title: "", 
		description: "", 
		price: "", 
		originalPrice: "",
		image: "", 
		category: "", 
		badge: "",
		stock: "100",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/products", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ 
					...form, 
					price: Number(form.price),
					originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
					stock: Number(form.stock) || 100,
					sold: 0,
					rating: 0,
					reviewCount: 0,
					shop: {
						id: "shop-1",
						name: "Bima Store",
						rating: 4.8,
					},
				}),
			});
			if (!res.ok) throw new Error((await res.json()).error ?? "Gagal menyimpan");
			router.push("/admin/products");
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
			<h1 className="mb-6 text-2xl font-bold">Tambah Produk</h1>
			<form onSubmit={onSubmit} className="space-y-4">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<label className="block text-sm sm:col-span-2">Judul
						<input className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-950" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
					</label>
					<label className="block text-sm">Harga (IDR)
						<input type="number" className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-950" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
					</label>
					<label className="block text-sm">Harga Asli (opsional, untuk diskon)
						<input type="number" className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-950" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} />
					</label>
					<label className="block text-sm">Kategori
						<select className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-950" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
							<option value="">Pilih Kategori</option>
							<option value="running">Running</option>
							<option value="training">Training</option>
							<option value="lifestyle">Lifestyle</option>
							<option value="basketball">Basketball</option>
							<option value="sale">Sale</option>
						</select>
					</label>
					<label className="block text-sm">Stok
						<input type="number" className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-950" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
					</label>
					<label className="block text-sm sm:col-span-2">Gambar (URL)
						<ImageURLHelper
							value={form.image}
							onChange={(url) => setForm({ ...form, image: url })}
						/>
					</label>
					<label className="block text-sm sm:col-span-2">Deskripsi
						<textarea className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-950" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
					</label>
					<label className="block text-sm">Badge (opsional)
						<select className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-950" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}>
							<option value="">Tidak ada</option>
							<option value="Baru">Baru</option>
							<option value="Best Seller">Best Seller</option>
							<option value="Sale">Sale</option>
						</select>
					</label>
				</div>
				{error && <p className="text-sm text-red-600">{error}</p>}
				<div className="flex gap-3">
					<button disabled={loading} className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black">{loading ? "Menyimpan..." : "Simpan"}</button>
					<button type="button" onClick={() => history.back()} className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900">Batal</button>
				</div>
			</form>
		</div>
	);
}



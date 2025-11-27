"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageURLHelper from "@/components/ImageURLHelper";

export default function KaryawanAddProduct() {
	const router = useRouter();
	const [form, setForm] = useState({ 
		title: "", 
		description: "", 
		price: "", 
		originalPrice: "",
		image: "", 
		category: "",
		navCategory: "", 
		badge: "",
		stock: "100",
		featured: true,
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
					featured: form.featured,
					navCategory: form.navCategory,
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
			router.push("/karyawan/products");
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold">Tambah Produk</h1>
				<Link href="/karyawan/products" className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
					Kembali
				</Link>
			</div>

			<div className="mb-4 grid grid-cols-3 gap-4">
				<Link href="/karyawan" className="rounded-lg border border-zinc-300 px-4 py-3 text-center hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900">
					Pesanan
				</Link>
				<Link href="/karyawan/products" className="rounded-lg border border-zinc-300 px-4 py-3 text-center hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900">
					Produk
				</Link>
				<Link href="/karyawan/add-product" className="rounded-lg border border-orange-500 bg-orange-50 px-4 py-3 text-center font-semibold text-orange-600 dark:bg-orange-900/20">
					Tambah Produk
				</Link>
			</div>

			<form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
				{error && <div className="rounded bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</div>}
				
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<label className="block text-sm sm:col-span-2">
						Judul Produk
						<input 
							className="mt-1 w-full rounded-lg border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-900" 
							value={form.title} 
							onChange={(e) => setForm({ ...form, title: e.target.value })} 
							required 
						/>
					</label>
					<label className="block text-sm">
						Harga (IDR)
						<input 
							type="number" 
							className="mt-1 w-full rounded-lg border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-900" 
							value={form.price} 
							onChange={(e) => setForm({ ...form, price: e.target.value })} 
							required 
						/>
					</label>
					<label className="block text-sm">
						Harga Asli (opsional, untuk diskon)
						<input 
							type="number" 
							className="mt-1 w-full rounded-lg border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-900" 
							value={form.originalPrice} 
							onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} 
						/>
					</label>
					<label className="block text-sm">
						Kategori Produk
						<select 
							className="mt-1 w-full rounded-lg border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-900" 
							value={form.category} 
							onChange={(e) => setForm({ ...form, category: e.target.value })} 
							required
						>
							<option value="">Pilih Kategori</option>
							<option value="running">Running</option>
							<option value="training">Training</option>
							<option value="lifestyle">Lifestyle</option>
							<option value="basketball">Basketball</option>
							<option value="sale">Sale</option>
						</select>
					</label>
					<label className="block text-sm">
						Kategori Navigasi
						<select 
							className="mt-1 w-full rounded-lg border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-900" 
							value={form.navCategory} 
							onChange={(e) => setForm({ ...form, navCategory: e.target.value })} 
							required
						>
							<option value="">Pilih Kategori Navigasi</option>
							<option value="pria">Pria</option>
							<option value="wanita">Wanita</option>
							<option value="anak">Anak</option>
							<option value="sale">Sale</option>
						</select>
						<p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
							Pilih kategori untuk menu navigasi (Pria, Wanita, Anak, atau Sale)
						</p>
					</label>
					<label className="block text-sm">
						Stok
						<input 
							type="number" 
							className="mt-1 w-full rounded-lg border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-900" 
							value={form.stock} 
							onChange={(e) => setForm({ ...form, stock: e.target.value })} 
							required 
						/>
					</label>
					<label className="block text-sm sm:col-span-2">
						Gambar (URL)
						<ImageURLHelper
							value={form.image}
							onChange={(url) => setForm({ ...form, image: url })}
						/>
					</label>
					<label className="block text-sm sm:col-span-2">
						Deskripsi
						<textarea 
							className="mt-1 w-full rounded-lg border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-900" 
							rows={4} 
							value={form.description} 
							onChange={(e) => setForm({ ...form, description: e.target.value })} 
						/>
					</label>
					<label className="block text-sm">
						Badge (opsional)
						<select 
							className="mt-1 w-full rounded-lg border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-900" 
							value={form.badge} 
							onChange={(e) => setForm({ ...form, badge: e.target.value })}
						>
							<option value="">Tidak ada</option>
							<option value="Baru">Baru</option>
							<option value="Best Seller">Best Seller</option>
							<option value="Sale">Sale</option>
						</select>
					</label>
					<label className="block text-sm sm:col-span-2">
						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								className="h-4 w-4 rounded border-zinc-300 text-orange-500 focus:ring-orange-500"
								checked={form.featured}
								onChange={(e) => setForm({ ...form, featured: e.target.checked })}
							/>
							<span>Tampilkan di Halaman Beranda</span>
						</div>
						<p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
							Produk akan ditampilkan di halaman utama sebagai produk unggulan
						</p>
					</label>
				</div>
				<div className="flex gap-3 pt-4">
					<button 
						disabled={loading} 
						className="flex-1 rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
					>
						{loading ? "Menyimpan..." : "Simpan Produk"}
					</button>
					<button 
						type="button" 
						onClick={() => router.back()} 
						className="rounded-lg border border-zinc-300 px-6 py-3 text-sm font-semibold hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
					>
						Batal
					</button>
				</div>
			</form>
		</div>
	);
}

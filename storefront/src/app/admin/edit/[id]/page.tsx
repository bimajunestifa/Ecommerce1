"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ImageURLHelper from "@/components/ImageURLHelper";

export default function EditProduct() {
	const params = useParams<{ id: string }>();
	const router = useRouter();
	const [form, setForm] = useState({ 
		id: "", 
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

	useEffect(() => {
		(async () => {
			const res = await fetch(`/api/products/${params.id}`);
			if (!res.ok) return setError("Produk tidak ditemukan");
			const p = await res.json();
			setForm({ 
				id: p.id, 
				title: p.title, 
				description: p.description ?? "", 
				price: String(p.price),
				originalPrice: p.originalPrice ? String(p.originalPrice) : "",
				image: p.image, 
				category: p.category,
				navCategory: p.navCategory ?? "", 
				badge: p.badge ?? "",
				stock: p.stock ? String(p.stock) : "100",
				featured: p.featured !== false,
			});
		})();
	}, [params.id]);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(`/api/products/${params.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ 
					...form, 
					price: Number(form.price),
					originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
					stock: Number(form.stock) || 100,
					featured: form.featured,
					navCategory: form.navCategory,
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

	async function onDelete() {
		if (!confirm("Hapus produk ini?")) return;
		setLoading(true);
		try {
			const res = await fetch(`/api/products/${params.id}`, { method: "DELETE" });
			if (!res.ok) throw new Error("Gagal menghapus");
			router.push("/admin/products");
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}
		return (
		<div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
			<h1 className="mb-6 text-2xl font-bold">Edit Produk</h1>
			<form onSubmit={onSubmit} className="space-y-4">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<label className="block text-sm">ID
						<input disabled className="mt-1 w-full rounded-md border border-zinc-300 bg-zinc-100 p-2 dark:border-zinc-700 dark:bg-zinc-900" value={form.id} readOnly />
					</label>
					<label className="block text-sm sm:col-span-2">Judul
						<input className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-950" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
					</label>
					<label className="block text-sm">Harga (IDR)
						<input type="number" className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-950" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
					</label>
					<label className="block text-sm">Harga Asli (opsional, untuk diskon)
						<input type="number" className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-950" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} />
					</label>
					<label className="block text-sm">Kategori Produk
						<select className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-950" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
							<option value="">Pilih Kategori</option>
							<option value="running">Running</option>
							<option value="training">Training</option>
							<option value="lifestyle">Lifestyle</option>
							<option value="basketball">Basketball</option>
							<option value="sale">Sale</option>
						</select>
					</label>
					<label className="block text-sm">Kategori Navigasi
						<select className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-950" value={form.navCategory} onChange={(e) => setForm({ ...form, navCategory: e.target.value })} required>
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
				{error && <p className="text-sm text-red-600">{error}</p>}
				<div className="flex gap-3">
					<button disabled={loading} className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black">{loading ? "Menyimpan..." : "Simpan"}</button>
					<button type="button" onClick={onDelete} disabled={loading} className="rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/30">Hapus</button>
					<button type="button" onClick={() => history.back()} className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900">Batal</button>
				</div>
			</form>
		</div>
	);
}



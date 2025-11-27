"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatIDR } from "@/lib/products";

export default function AdminProductsPage() {
	const { user, loading: authLoading } = useAuth();
	const router = useRouter();
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		if (!authLoading && (!user || user.role !== "admin")) {
			router.push("/");
			return;
		}

		if (user && user.role === "admin") {
			fetchProducts();
		}
	}, [user, authLoading, router]);

	const fetchProducts = async () => {
		try {
			const res = await fetch("/api/products");
			const data = await res.json();
			setProducts(data || []);
		} catch (error) {
			console.error("Error fetching products:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (productId: string) => {
		if (!confirm("Yakin ingin menghapus produk ini?")) return;

		try {
			const res = await fetch(`/api/products/${productId}`, {
				method: "DELETE",
			});

			if (res.ok) {
				fetchProducts();
			} else {
				alert("Gagal menghapus produk");
			}
		} catch (error) {
			console.error("Error deleting product:", error);
			alert("Terjadi kesalahan");
		}
	};

	const toggleFeatured = async (productId: string, currentFeatured: boolean) => {
		try {
			const res = await fetch(`/api/products/${productId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ featured: !currentFeatured }),
			});

			if (res.ok) {
				fetchProducts();
			} else {
				alert("Gagal mengupdate status featured");
			}
		} catch (error) {
			console.error("Error updating featured:", error);
			alert("Terjadi kesalahan");
		}
	};

	if (authLoading || loading) {
		return (
			<div className="mx-auto max-w-7xl px-4 py-16 text-center">
				<p>Memuat...</p>
			</div>
		);
	}

	if (!user || user.role !== "admin") {
		return null;
	}

	const filteredProducts = products.filter((p) =>
		p.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Kelola Produk</h1>
					<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Tambah, edit, dan hapus produk</p>
				</div>
				<Link
					href="/admin/products/new"
					className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
				>
					+ Tambah Produk
				</Link>
			</div>

			<div className="mb-4">
				<input
					type="text"
					placeholder="Cari produk..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
				/>
			</div>

			{filteredProducts.length === 0 ? (
				<div className="rounded-lg border border-zinc-200 p-16 text-center dark:border-zinc-800">
					<p className="text-zinc-600 dark:text-zinc-400">Belum ada produk</p>
					<Link
						href="/admin/products/new"
						className="mt-4 inline-block rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600"
					>
						Tambah Produk Pertama
					</Link>
				</div>
			) : (
				<div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
					<table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
						<thead className="bg-zinc-50 dark:bg-zinc-900">
							<tr>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase">Gambar</th>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase">Nama Produk</th>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase">Kategori</th>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase">Harga</th>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase">Stok</th>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase">Terjual</th>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase">Beranda</th>
								<th className="px-4 py-3 text-right text-xs font-semibold uppercase">Aksi</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
							{filteredProducts.map((product) => (
								<tr key={product.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
									<td className="px-4 py-3">
										<div className="h-16 w-16 rounded-lg border bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
											{product.image ? (
												<img 
													src={product.image} 
													alt={product.title} 
													className="h-full w-full object-cover"
													loading="lazy"
													onError={(e) => {
														const target = e.target as HTMLImageElement;
														target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect fill='%23e5e7eb' width='64' height='64'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='10'%3ENo Image%3C/text%3E%3C/svg%3E";
													}}
												/>
											) : (
												<div className="flex h-full w-full items-center justify-center">
													<span className="text-xs text-zinc-400 px-2 text-center">No Image</span>
												</div>
											)}
										</div>
									</td>
									<td className="px-4 py-3">
										<p className="font-medium">{product.title}</p>
										<p className="text-xs text-zinc-600 dark:text-zinc-400">ID: {product.id}</p>
									</td>
									<td className="px-4 py-3 text-sm capitalize">{product.category}</td>
									<td className="px-4 py-3 text-sm font-semibold">{formatIDR(product.price)}</td>
									<td className="px-4 py-3 text-sm">{product.stock || 0}</td>
									<td className="px-4 py-3 text-sm">{product.sold || 0}</td>
									<td className="px-4 py-3">
										<label className="relative inline-flex cursor-pointer items-center">
											<input
												type="checkbox"
												className="peer sr-only"
												checked={product.featured !== false}
												onChange={() => toggleFeatured(product.id, product.featured !== false)}
											/>
											<div className="peer h-6 w-11 rounded-full bg-zinc-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-zinc-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-orange-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:border-zinc-600 dark:bg-zinc-700 dark:peer-focus:ring-orange-800"></div>
											<span className="ml-3 text-xs text-zinc-600 dark:text-zinc-400">
												{product.featured !== false ? "Ya" : "Tidak"}
											</span>
										</label>
									</td>
									<td className="px-4 py-3 text-right">
										<div className="flex justify-end gap-2">
											<Link
												href={`/admin/products/edit/${product.id}`}
												className="rounded px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
											>
												Edit
											</Link>
											<button
												onClick={() => handleDelete(product.id)}
												className="rounded px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
											>
												Hapus
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

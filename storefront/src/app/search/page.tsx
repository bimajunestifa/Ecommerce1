"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/lib/types";
import { formatIDR } from "@/lib/products";
import Link from "next/link";

function SearchContent() {
	const searchParams = useSearchParams();
	const query = searchParams.get("q") || "";
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState(query);
	const [category, setCategory] = useState("all");

	useEffect(() => {
		if (query) {
			searchProducts(query);
		}
	}, [query]);

	const searchProducts = async (searchTerm: string) => {
		setLoading(true);
		try {
			const res = await fetch("/api/products");
			const allProducts = await res.json();
			const filtered = allProducts.filter((p: Product) => {
				const matchesSearch = searchTerm
					? p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					  (p.description || "").toLowerCase().includes(searchTerm.toLowerCase())
					: true;
				const matchesCategory = category === "all" || p.category === category;
				return matchesSearch && matchesCategory;
			});
			setProducts(filtered);
		} catch (error) {
			console.error("Error searching products:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		searchProducts(searchQuery);
	};

	return (
		<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
			<form onSubmit={handleSearch} className="mb-8">
				<div className="flex gap-4">
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Cari produk..."
						className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
					/>
					<button
						type="submit"
						className="rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600"
					>
						Cari
					</button>
				</div>
			</form>

			<div className="mb-4 flex gap-2 overflow-x-auto">
				<button
					onClick={() => {
						setCategory("all");
						searchProducts(searchQuery);
					}}
					className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
						category === "all"
							? "bg-orange-500 text-white"
							: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
					}`}
				>
					Semua
				</button>
				{["running", "training", "lifestyle", "sale"].map((cat) => (
					<button
						key={cat}
						onClick={() => {
							setCategory(cat);
							searchProducts(searchQuery);
						}}
						className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium capitalize ${
							category === cat
								? "bg-orange-500 text-white"
								: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
						}`}
					>
						{cat}
					</button>
				))}
			</div>

			{loading ? (
				<div className="text-center py-16">Memuat...</div>
			) : products.length === 0 ? (
				<div className="rounded-lg border border-zinc-200 p-16 text-center dark:border-zinc-800">
					<p className="text-zinc-600 dark:text-zinc-400">Tidak ada produk ditemukan</p>
				</div>
			) : (
				<>
					<p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
						Menampilkan {products.length} produk
					</p>
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
						{products.map((product) => (
							<Link key={product.id} href={`/product/${product.id}`} className="group">
								<div className="aspect-square rounded-lg border bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900" />
								<h3 className="mt-2 text-sm font-medium line-clamp-2 group-hover:text-orange-500">
									{product.title}
								</h3>
								<p className="mt-1 text-sm font-semibold">{formatIDR(product.price)}</p>
								{product.originalPrice && product.originalPrice > product.price && (
									<p className="text-xs text-zinc-400 line-through">
										{formatIDR(product.originalPrice)}
									</p>
								)}
							</Link>
						))}
					</div>
				</>
			)}
		</div>
	);
}

export default function SearchPage() {
	return (
		<Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 text-center">Memuat...</div>}>
			<SearchContent />
		</Suspense>
	);
}

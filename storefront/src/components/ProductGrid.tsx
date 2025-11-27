import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/types";

async function getProducts() {
	const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
	const res = await fetch(`${base}/api/products`, { cache: "no-store" });
	if (!res.ok) return [];
	return (await res.json()) as Product[];
}

export default async function ProductGrid() {
	const products = await getProducts();
	// Filter produk yang featured = true, atau semua produk jika tidak ada yang featured
	const featuredProducts = products.filter(p => p.featured !== false).slice(0, 8);

	return (
		<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div className="mb-6 flex items-end justify-between">
				<h2 className="text-xl font-semibold tracking-tight">Produk Unggulan</h2>
				<a href="/products" className="text-sm font-medium underline-offset-4 hover:underline">Lihat semua</a>
			</div>
			{featuredProducts.length === 0 ? (
				<div className="rounded-lg border border-zinc-200 p-16 text-center dark:border-zinc-800">
					<p className="text-zinc-600 dark:text-zinc-400">Belum ada produk</p>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{featuredProducts.map((p) => (
						<ProductCard key={p.id} product={p} />
					))}
				</div>
			)}
		</section>
	);
}



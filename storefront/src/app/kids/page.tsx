import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/types";

async function getProducts() {
	const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
	const res = await fetch(`${base}/api/products`, { cache: "no-store" });
	if (!res.ok) return [];
	return (await res.json()) as Product[];
}

export default async function KidsPage() {
	const products = await getProducts();
	const kidsProducts = products.filter((p) => p.navCategory === "anak");

	return (
		<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
			<h1 className="mb-8 text-3xl font-bold">Produk Anak</h1>
			{kidsProducts.length === 0 ? (
				<div className="rounded-lg border border-zinc-200 p-16 text-center dark:border-zinc-800">
					<p className="text-zinc-600 dark:text-zinc-400">Belum ada produk untuk kategori ini</p>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{kidsProducts.map((p) => (
						<ProductCard key={p.id} product={p} />
					))}
				</div>
			)}
		</div>
	);
}


import ProductCard from "@/components/ProductCard";
import { readProducts } from "@/lib/db";

export default async function SalePage() {
	const products = readProducts();
	const saleProducts = products.filter((p) => p.navCategory === "sale" || p.originalPrice);

	return (
		<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
			<h1 className="mb-8 text-3xl font-bold">Produk Sale</h1>
			{saleProducts.length === 0 ? (
				<div className="rounded-lg border border-zinc-200 p-16 text-center dark:border-zinc-800">
					<p className="text-zinc-600 dark:text-zinc-400">Belum ada produk sale</p>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{saleProducts.map((p) => (
						<ProductCard key={p.id} product={p} />
					))}
				</div>
			)}
		</div>
	);
}


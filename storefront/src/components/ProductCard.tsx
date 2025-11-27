"use client";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatIDR } from "@/lib/products";

type Props = {
	product: Product;
};

function StarRating({ rating }: { rating: number }) {
	return (
		<div className="flex items-center gap-1">
			{[1, 2, 3, 4, 5].map((star) => (
				<svg
					key={star}
					className={`h-3 w-3 ${star <= Math.round(rating) ? "text-yellow-400" : "text-zinc-300"}`}
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
				</svg>
			))}
		</div>
	);
}

export default function ProductCard({ product }: Props) {
	return (
		<Link
			href={`/product/${product.id}`}
			className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:shadow-lg dark:border-zinc-800 dark:bg-black"
		>
			<div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
				{product.image ? (
					<img
						src={product.image}
						alt={product.title}
						className="h-full w-full object-contain p-6 transition-transform duration-300 group-hover:scale-105"
						onError={(e) => {
							(e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='14'%3EGambar tidak tersedia%3C/text%3E%3C/svg%3E";
						}}
					/>
				) : (
					<div className="h-full w-full" />
				)}
				{product.badge && (
					<span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
						{product.badge}
					</span>
				)}
			</div>
			<div className="p-4">
				<h3 className="line-clamp-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">{product.title}</h3>
				<div className="mt-2 flex items-center gap-2">
					<StarRating rating={product.rating || 0} />
					<span className="text-xs text-zinc-600 dark:text-zinc-400">
						({product.reviewCount || 0})
					</span>
				</div>
				<div className="mt-2">
					{product.originalPrice && product.originalPrice > product.price ? (
						<div className="flex items-center gap-2">
							<p className="text-base font-semibold text-orange-500">{formatIDR(product.price)}</p>
							<p className="text-xs text-zinc-400 line-through">{formatIDR(product.originalPrice)}</p>
						</div>
					) : (
						<p className="text-base font-semibold">{formatIDR(product.price)}</p>
					)}
				</div>
				{product.sold !== undefined && product.sold > 0 && (
					<p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">Terjual {product.sold}</p>
				)}
			</div>
		</Link>
	);
}



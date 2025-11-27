import { notFound } from "next/navigation";
import { formatIDR } from "@/lib/products";
import { Product, Review } from "@/lib/types";
import AddToCart from "@/components/product/AddToCart";
import ProductReviews from "@/components/product/ProductReviews";
import WishlistButton from "@/components/product/WishlistButton";
import ProductImageZoom from "@/components/product/ProductImageZoom";

import { findProduct } from "@/lib/db";
import { findReviewsByProductId } from "@/lib/db";

async function getProduct(id: string) {
	return findProduct(id);
}

async function getReviews(productId: string) {
	return findReviewsByProductId(productId);
}

function StarRating({ rating }: { rating: number }) {
	return (
		<div className="flex items-center gap-1">
			{[1, 2, 3, 4, 5].map((star) => (
				<svg
					key={star}
					className={`h-5 w-5 ${star <= rating ? "text-yellow-400" : "text-zinc-300"}`}
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
				</svg>
			))}
		</div>
	);
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const product = await getProduct(id);
	if (!product) return notFound();
	
	const reviews = await getReviews(id);
	const averageRating = reviews.length > 0 
		? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
		: product.rating || 0;

	return (
		<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				<div>
					<ProductImageZoom
						images={product.images && product.images.length > 0 ? product.images : [product.image]}
						title={product.title}
					/>
				</div>
				<div>
					<p className="text-sm text-zinc-500">{product.category}</p>
					<h1 className="mt-2 text-3xl font-bold">{product.title}</h1>
					
					<div className="mt-4 flex items-center gap-4">
						<div className="flex items-center gap-2">
							<StarRating rating={Math.round(averageRating)} />
							<span className="text-sm text-zinc-600 dark:text-zinc-400">
								({reviews.length} ulasan)
							</span>
						</div>
						<span className="text-sm text-zinc-600 dark:text-zinc-400">
							Terjual {product.sold || 0}
						</span>
					</div>

					<div className="mt-4">
						{product.originalPrice && product.originalPrice > product.price ? (
							<div className="flex items-center gap-2">
								<p className="text-2xl font-semibold text-orange-500">{formatIDR(product.price)}</p>
								<p className="text-lg text-zinc-400 line-through">{formatIDR(product.originalPrice)}</p>
								<span className="rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-600 dark:bg-red-900/20 dark:text-red-400">
									{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
								</span>
							</div>
						) : (
							<p className="text-2xl font-semibold">{formatIDR(product.price)}</p>
						)}
					</div>

					{product.shop && (
						<div className="mt-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
							<div className="flex items-center gap-3">
								<div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
									{product.shop.name.charAt(0)}
								</div>
								<div>
									<p className="font-semibold">{product.shop.name}</p>
									<div className="flex items-center gap-1">
										<StarRating rating={Math.round(product.shop.rating)} />
										<span className="text-sm text-zinc-600 dark:text-zinc-400">{product.shop.rating}</span>
									</div>
								</div>
							</div>
						</div>
					)}

					<p className="mt-6 text-zinc-600 dark:text-zinc-400">{product.description || "Tidak ada deskripsi"}</p>

					<div className="mt-6 flex gap-4">
						<div className="flex-1">
							<AddToCart product={{ id: product.id, title: product.title, price: product.price, image: product.image }} />
						</div>
						<WishlistButton productId={product.id} />
					</div>

					{product.stock !== undefined && (
						<p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
							Stok: {product.stock > 0 ? `${product.stock} tersedia` : "Habis"}
						</p>
					)}
				</div>
			</div>

			<div className="mt-12">
				<ProductReviews productId={id} initialReviews={reviews} />
			</div>
		</div>
	);
}
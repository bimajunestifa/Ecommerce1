"use client";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import Link from "next/link";
import { formatIDR } from "@/lib/products";

export default function WishlistPage() {
	const { user, loading } = useAuth();
	const router = useRouter();
	const [wishlist, setWishlist] = useState<string[]>([]);
	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		if (!loading && !user) {
			router.push("/login");
		}
	}, [user, loading, router]);

	useEffect(() => {
		if (user) {
			fetchWishlist();
		}
	}, [user]);

	const fetchWishlist = async () => {
		try {
			const res = await fetch("/api/wishlist");
			const data = await res.json();
			setWishlist(data.wishlist || []);
			
			if (data.wishlist && data.wishlist.length > 0) {
				const productPromises = data.wishlist.map((id: string) =>
					fetch(`/api/products/${id}`).then((r) => r.json())
				);
				const productData = await Promise.all(productPromises);
				setProducts(productData.filter((p) => p.id));
			}
		} catch (error) {
			console.error("Error fetching wishlist:", error);
		}
	};

	const removeFromWishlist = async (productId: string) => {
		try {
			await fetch("/api/wishlist", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ productId }),
			});
			setWishlist(wishlist.filter((id) => id !== productId));
			setProducts(products.filter((p) => p.id !== productId));
		} catch (error) {
			console.error("Error removing from wishlist:", error);
		}
	};

	if (loading) {
		return <div className="mx-auto max-w-7xl px-4 py-16 text-center">Memuat...</div>;
	}

	if (!user) {
		return null;
	}

	return (
		<div className="mx-auto max-w-7xl px-4 py-16">
			<h1 className="mb-8 text-3xl font-bold">Wishlist Saya</h1>
			{products.length === 0 ? (
				<div className="rounded-lg border border-zinc-200 p-16 text-center dark:border-zinc-800">
					<svg
						className="mx-auto mb-4 h-16 w-16 text-zinc-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
						/>
					</svg>
					<p className="text-zinc-600 dark:text-zinc-400">Wishlist Anda kosong</p>
					<Link href="/" className="mt-4 inline-block rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600">
						Mulai Belanja
					</Link>
				</div>
			) : (
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
					{products.map((product) => (
						<div key={product.id} className="group relative">
							<Link href={`/product/${product.id}`} className="block">
								<div className="relative aspect-square overflow-hidden rounded-lg border bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
									{product.image ? (
										<img
											src={product.image}
											alt={product.title}
											className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
											onError={(e) => {
												const target = e.target as HTMLImageElement;
												target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23e5e7eb' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
											}}
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center">
											<span className="text-xs text-zinc-400">No Image</span>
										</div>
									)}
								</div>
								<h3 className="mt-2 text-sm font-medium line-clamp-2">{product.title}</h3>
								<p className="mt-1 text-sm font-semibold">{formatIDR(product.price)}</p>
							</Link>
							<button
								onClick={() => removeFromWishlist(product.id)}
								className="absolute right-2 top-2 rounded-full bg-white p-2 shadow-lg hover:bg-red-50 dark:bg-zinc-900 dark:hover:bg-red-900/20"
							>
								<svg
									className="h-5 w-5 text-red-500"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
								</svg>
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

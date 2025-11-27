"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";

export default function WishlistButton({ productId }: { productId: string }) {
	const { user } = useAuth();
	const [isInWishlist, setIsInWishlist] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (user) {
			checkWishlist();
		}
	}, [user, productId]);

	const checkWishlist = async () => {
		try {
			const res = await fetch("/api/wishlist");
			const data = await res.json();
			setIsInWishlist((data.wishlist || []).includes(productId));
		} catch (error) {
			console.error("Error checking wishlist:", error);
		}
	};

	const toggleWishlist = async () => {
		if (!user) {
			window.location.href = "/login";
			return;
		}

		setLoading(true);
		try {
			if (isInWishlist) {
				await fetch("/api/wishlist", {
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ productId }),
				});
				setIsInWishlist(false);
			} else {
				await fetch("/api/wishlist", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ productId }),
				});
				setIsInWishlist(true);
			}
		} catch (error) {
			console.error("Error toggling wishlist:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<button
			onClick={toggleWishlist}
			disabled={loading || !user}
			className={`rounded-lg border px-4 py-2 ${
				isInWishlist
					? "border-red-300 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
					: "border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
			} disabled:opacity-50`}
		>
			<svg
				className={`h-5 w-5 ${isInWishlist ? "fill-current" : ""}`}
				fill={isInWishlist ? "currentColor" : "none"}
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
		</button>
	);
}

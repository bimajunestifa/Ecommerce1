"use client";
import { useState, useEffect } from "react";
import { Review } from "@/lib/types";
import { useAuth } from "../AuthContext";

export default function ProductReviews({ productId, initialReviews }: { productId: string; initialReviews: Review[] }) {
	const { user } = useAuth();
	const [reviews, setReviews] = useState<Review[]>(initialReviews);
	const [rating, setRating] = useState(5);
	const [comment, setComment] = useState("");
	const [showForm, setShowForm] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) {
			window.location.href = "/login";
			return;
		}

		setLoading(true);
		try {
			const res = await fetch("/api/reviews", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ productId, rating, comment }),
			});

			if (res.ok) {
				const data = await res.json();
				setReviews([data.review, ...reviews]);
				setComment("");
				setShowForm(false);
			}
		} catch (error) {
			console.error("Error submitting review:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<div className="mb-6 flex items-center justify-between">
				<h2 className="text-2xl font-bold">Ulasan ({reviews.length})</h2>
				{user && (
					<button
						onClick={() => setShowForm(!showForm)}
						className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
					>
						{showForm ? "Batal" : "Tulis Ulasan"}
					</button>
				)}
			</div>

			{showForm && (
				<form onSubmit={handleSubmit} className="mb-8 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
					<div className="mb-4">
						<label className="mb-2 block text-sm font-medium">Rating</label>
						<div className="flex gap-1">
							{[1, 2, 3, 4, 5].map((star) => (
								<button
									key={star}
									type="button"
									onClick={() => setRating(star)}
									className={`h-8 w-8 ${
										star <= rating ? "text-yellow-400" : "text-zinc-300"
									}`}
								>
									<svg fill="currentColor" viewBox="0 0 20 20">
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
								</button>
							))}
						</div>
					</div>
					<div className="mb-4">
						<label htmlFor="comment" className="mb-2 block text-sm font-medium">
							Ulasan
						</label>
						<textarea
							id="comment"
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							required
							rows={4}
							className="w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
						/>
					</div>
					<button
						type="submit"
						disabled={loading}
						className="rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
					>
						{loading ? "Mengirim..." : "Kirim Ulasan"}
					</button>
				</form>
			)}

			<div className="space-y-6">
				{reviews.length === 0 ? (
					<p className="text-center text-zinc-600 dark:text-zinc-400">Belum ada ulasan</p>
				) : (
					reviews.map((review) => (
						<div key={review.id} className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
							<div className="mb-4 flex items-center gap-4">
								<div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
									{review.userName.charAt(0).toUpperCase()}
								</div>
								<div className="flex-1">
									<p className="font-semibold">{review.userName}</p>
									<div className="flex items-center gap-2">
										<div className="flex gap-1">
											{[1, 2, 3, 4, 5].map((star) => (
												<svg
													key={star}
													className={`h-4 w-4 ${star <= review.rating ? "text-yellow-400" : "text-zinc-300"}`}
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
												</svg>
											))}
										</div>
										<span className="text-sm text-zinc-600 dark:text-zinc-400">
											{new Date(review.createdAt).toLocaleDateString("id-ID")}
										</span>
									</div>
								</div>
							</div>
							<p className="text-zinc-700 dark:text-zinc-300">{review.comment}</p>
						</div>
					))
				)}
			</div>
		</div>
	);
}

"use client";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Order, TrackingHistory } from "@/lib/types";
import { formatIDR } from "@/lib/products";
import Link from "next/link";
import { BackButton } from "@/components/BackButton";

const statusLabels: Record<string, string> = {
	pending: "Menunggu Pembayaran",
	paid: "Sudah Dibayar",
	processing: "Diproses",
	shipped: "Dikirim",
	delivered: "Selesai",
	cancelled: "Dibatalkan",
};

const statusColors: Record<string, string> = {
	pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
	paid: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
	processing: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
	shipped: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400",
	delivered: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
	cancelled: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
};

export default function OrdersPage() {
	const { user, loading } = useAuth();
	const router = useRouter();
	const [orders, setOrders] = useState<Order[]>([]);
	const [filterStatus, setFilterStatus] = useState<string>("all");
	const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

	useEffect(() => {
		if (!loading && !user) {
			router.push("/login");
		}
	}, [user, loading, router]);

	useEffect(() => {
		if (user) {
			fetchOrders();
		}
	}, [user]);

	const fetchOrders = async () => {
		try {
			const res = await fetch("/api/orders");
			const data = await res.json();
			setOrders(data.orders || []);
		} catch (error) {
			console.error("Error fetching orders:", error);
		}
	};

	if (loading) {
		return <div className="mx-auto max-w-7xl px-4 py-16 text-center">Memuat...</div>;
	}

	if (!user) {
		return null;
	}

	const filteredOrders = filterStatus === "all" 
		? orders 
		: orders.filter((o) => o.status === filterStatus);

	// Generate tracking history if not exists
	const getTrackingHistory = (order: Order): TrackingHistory[] => {
		if (order.trackingHistory && order.trackingHistory.length > 0) {
			return order.trackingHistory;
		}

		const history: TrackingHistory[] = [];
		
		// Pending
		if (["pending", "paid", "processing", "shipped", "delivered", "cancelled"].includes(order.status)) {
			history.push({
				status: "pending",
				message: "Pesanan dibuat",
				location: "Sistem",
				timestamp: order.createdAt,
			});
		}

		// Paid
		if (["paid", "processing", "shipped", "delivered"].includes(order.status)) {
			const paidDate = new Date(order.createdAt);
			paidDate.setHours(paidDate.getHours() + 1);
			history.push({
				status: "paid",
				message: "Pembayaran telah diterima",
				location: "Sistem",
				timestamp: paidDate.toISOString(),
			});
		}

		// Processing
		if (["processing", "shipped", "delivered"].includes(order.status)) {
			const processingDate = new Date(order.createdAt);
			processingDate.setHours(processingDate.getHours() + 2);
			history.push({
				status: "processing",
				message: "Pesanan sedang dikemas",
				location: "Gudang Jakarta",
				timestamp: processingDate.toISOString(),
			});
		}

		// Shipped
		if (["shipped", "delivered"].includes(order.status)) {
			const shippedDate = new Date(order.createdAt);
			shippedDate.setHours(shippedDate.getHours() + 4);
			history.push({
				status: "shipped",
				message: order.trackingNumber 
					? `Pesanan dikirim dengan nomor resi: ${order.trackingNumber}`
					: "Pesanan dikirim",
				location: "Jakarta",
				timestamp: shippedDate.toISOString(),
			});
		}

		// In Transit updates
		if (order.status === "shipped") {
			const transitDate = new Date(order.createdAt);
			transitDate.setDate(transitDate.getDate() + 1);
			history.push({
				status: "shipped",
				message: "Pesanan dalam perjalanan",
				location: "Kota Tujuan",
				timestamp: transitDate.toISOString(),
			});
		}

		// Delivered
		if (order.status === "delivered") {
			const deliveredDate = new Date(order.createdAt);
			deliveredDate.setDate(deliveredDate.getDate() + 2);
			history.push({
				status: "delivered",
				message: "Pesanan telah diterima",
				location: order.shippingAddress.city || "Tujuan",
				timestamp: deliveredDate.toISOString(),
			});
		}

		return history;
	};

	const toggleOrderHistory = (orderId: string) => {
		setExpandedOrders(prev => {
			const newSet = new Set(prev);
			if (newSet.has(orderId)) {
				newSet.delete(orderId);
			} else {
				newSet.add(orderId);
			}
			return newSet;
		});
	};

	return (
		<div className="mx-auto max-w-7xl px-4 py-16">
			<div className="mb-6">
				<BackButton href="/" label="Kembali ke Beranda" />
			</div>
			<h1 className="mb-8 text-3xl font-bold">Pesanan Saya</h1>
			
			{/* Filter Tabs */}
			<div className="mb-6 flex gap-2 overflow-x-auto border-b border-zinc-200 dark:border-zinc-800">
				<button
					onClick={() => setFilterStatus("all")}
					className={`whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium ${
						filterStatus === "all"
							? "border-orange-500 text-orange-600 dark:text-orange-400"
							: "border-transparent text-zinc-600 hover:border-zinc-300 dark:text-zinc-400"
					}`}
				>
					Semua ({orders.length})
				</button>
				{Object.entries(statusLabels).map(([status, label]) => {
					const count = orders.filter((o) => o.status === status).length;
					if (count === 0) return null;
					return (
						<button
							key={status}
							onClick={() => setFilterStatus(status)}
							className={`whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium ${
								filterStatus === status
									? "border-orange-500 text-orange-600 dark:text-orange-400"
									: "border-transparent text-zinc-600 hover:border-zinc-300 dark:text-zinc-400"
							}`}
						>
							{label} ({count})
						</button>
					);
				})}
			</div>

			{filteredOrders.length === 0 ? (
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
							d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
						/>
					</svg>
					<p className="text-zinc-600 dark:text-zinc-400">Anda belum memiliki pesanan</p>
					<Link href="/" className="mt-4 inline-block rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600">
						Mulai Belanja
					</Link>
				</div>
			) : (
				<div className="space-y-4">
					{filteredOrders.map((order) => (
						<div key={order.id} className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
							<div className="mb-4 flex items-center justify-between">
								<div>
									<p className="text-sm text-zinc-600 dark:text-zinc-400">Order ID: {order.id}</p>
									<p className="text-sm text-zinc-600 dark:text-zinc-400">
										{new Date(order.createdAt).toLocaleDateString("id-ID", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</p>
								</div>
								<span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status]}`}>
									{statusLabels[order.status]}
								</span>
							</div>
							{order.trackingNumber && (
								<div className="mb-4 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-xs text-zinc-600 dark:text-zinc-400">Nomor Resi</p>
											<p className="font-semibold">{order.trackingNumber}</p>
										</div>
										{order.status === "shipped" && (
											<svg className="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
										)}
									</div>
								</div>
							)}
							<div className="space-y-2">
								{order.items.map((item, idx) => (
									<div key={idx} className="flex gap-4">
										<div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
											{item.image && (
												<img src={item.image} alt={item.title} className="h-full w-full object-cover" />
											)}
										</div>
										<div className="flex-1">
											<Link href={`/product/${item.productId}`} className="font-medium hover:underline">
												{item.title}
											</Link>
											<p className="text-sm text-zinc-600 dark:text-zinc-400">
												{formatIDR(item.price)} x {item.quantity}
											</p>
										</div>
									</div>
								))}
							</div>
							{/* Tracking History Section */}
							{expandedOrders.has(order.id) && (
								<div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
									<h4 className="mb-4 text-sm font-semibold">History Paket</h4>
									<div className="space-y-3">
										{getTrackingHistory(order).map((track, index) => {
											const isActive = index <= getTrackingHistory(order).findIndex((h) => h.status === order.status);
											const isCurrent = track.status === order.status;
											
											return (
												<div key={index} className="flex gap-3">
													<div className="flex flex-col items-center">
														<div
															className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
																isActive
																	? "bg-orange-500 text-white"
																	: "bg-zinc-300 text-zinc-500 dark:bg-zinc-700"
															}`}
														>
															{isCurrent ? (
																<div className="h-2 w-2 rounded-full bg-white" />
															) : isActive ? (
																<svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
																</svg>
															) : (
																<div className="h-1.5 w-1.5 rounded-full bg-current" />
															)}
														</div>
														{index < getTrackingHistory(order).length - 1 && (
															<div className={`mt-1 h-8 w-0.5 ${isActive ? "bg-orange-500" : "bg-zinc-300 dark:bg-zinc-700"}`} />
														)}
													</div>
													<div className="flex-1 pb-2">
														<div className={`text-sm font-medium ${isActive ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400"}`}>
															{track.message}
														</div>
														{track.location && (
															<div className={`mt-0.5 text-xs ${isActive ? "text-zinc-600 dark:text-zinc-400" : "text-zinc-400"}`}>
																📍 {track.location}
															</div>
														)}
														<div className={`mt-1 text-xs ${isActive ? "text-zinc-500" : "text-zinc-400"}`}>
															{new Date(track.timestamp).toLocaleString("id-ID", {
																year: "numeric",
																month: "short",
																day: "numeric",
																hour: "2-digit",
																minute: "2-digit",
															})}
														</div>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							)}

							<div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
								<p className="text-lg font-semibold">Total: {formatIDR(order.total)}</p>
								<div className="flex gap-2">
									{order.status === "pending" && order.paymentMethod === "bank_transfer" && (
										<Link
											href={`/payment/${order.id}`}
											className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
										>
											Bayar Sekarang
										</Link>
									)}
									<button
										onClick={() => toggleOrderHistory(order.id)}
										className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
									>
										{expandedOrders.has(order.id) ? "Sembunyikan History" : "Lihat History Paket"}
									</button>
									<Link
										href={`/orders/${order.id}`}
										className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
									>
										Detail Pesanan
									</Link>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

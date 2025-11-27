"use client";
import { useAuth } from "@/components/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Order, TrackingHistory } from "@/lib/types";
import { formatIDR } from "@/lib/products";
import Link from "next/link";

const statusLabels: Record<string, string> = {
	pending: "Menunggu Pembayaran",
	paid: "Sudah Dibayar",
	processing: "Sedang Diproses",
	shipped: "Sedang Dikirim",
	delivered: "Selesai",
	cancelled: "Dibatalkan",
};

const statusDescriptions: Record<string, string> = {
	pending: "Menunggu pembayaran dari pembeli",
	paid: "Pembayaran telah diterima",
	processing: "Pesanan sedang disiapkan",
	shipped: "Pesanan sedang dalam perjalanan",
	delivered: "Pesanan telah diterima pembeli",
	cancelled: "Pesanan dibatalkan",
};

const statusIcons: Record<string, string> = {
	pending: "⏳",
	paid: "💰",
	processing: "📦",
	shipped: "🚚",
	delivered: "✅",
	cancelled: "❌",
};

export default function OrderDetailClient() {
	const { user, loading: authLoading } = useAuth();
	const router = useRouter();
	const params = useParams<{ id: string }>();
	const [order, setOrder] = useState<Order | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!authLoading && !user) {
			router.push("/login");
		}
	}, [user, authLoading, router]);

	useEffect(() => {
		if (user && params.id) {
			fetchOrder();
		}
	}, [user, params.id]);

	const fetchOrder = async () => {
		try {
			const res = await fetch(`/api/orders/${params.id}`);
			if (!res.ok) {
				router.push("/orders");
				return;
			}
			const data = await res.json();
			setOrder(data.order);
		} catch (error) {
			console.error("Error fetching order:", error);
			router.push("/orders");
		} finally {
			setLoading(false);
		}
	};

	if (loading || authLoading) {
		return <div className="mx-auto max-w-7xl px-4 py-16 text-center">Memuat...</div>;
	}

	if (!user || !order) {
		return null;
	}

	// Generate tracking history if not exists
	const getTrackingHistory = (): TrackingHistory[] => {
		if (order.trackingHistory && order.trackingHistory.length > 0) {
			return order.trackingHistory;
		}

		const history: TrackingHistory[] = [];
		const now = new Date();

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

	const trackingHistory = getTrackingHistory();
	const currentStatusIndex = trackingHistory.findIndex((h) => h.status === order.status);
	const estimatedDelivery = order.estimatedDelivery || (() => {
		const date = new Date(order.createdAt);
		date.setDate(date.getDate() + 3);
		return date.toISOString();
	})();

	return (
		<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
			<Link href="/orders" className="mb-6 inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
				<svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
				</svg>
				Kembali ke Daftar Pesanan
			</Link>

			<div className="mb-8">
				<h1 className="text-3xl font-bold">Detail Pesanan</h1>
				<p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Order ID: {order.id}</p>
			</div>

			{/* Status Card */}
			<div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
				<div className="mb-4 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl dark:bg-orange-900/20">
							{statusIcons[order.status]}
						</div>
						<div>
							<h2 className="text-xl font-semibold">{statusLabels[order.status]}</h2>
							<p className="text-sm text-zinc-600 dark:text-zinc-400">{statusDescriptions[order.status]}</p>
						</div>
					</div>
					{order.status === "pending" && order.paymentMethod === "bank_transfer" && (
						<Link
							href={`/payment/${order.id}`}
							className="rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600"
						>
							Bayar Sekarang
						</Link>
					)}
				</div>

				{order.trackingNumber && (
					<div className="mt-4 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Nomor Resi</p>
								<p className="text-lg font-bold">{order.trackingNumber}</p>
								{order.courier && (
									<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Kurir: {order.courier}</p>
								)}
							</div>
							<button
								onClick={() => {
									if (order.trackingNumber) {
										window.open(`https://cekresi.com/?resi=${order.trackingNumber}&kurir=${order.courier || "jne"}`, "_blank");
									}
								}}
								className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
							>
								Cek Resi
							</button>
						</div>
					</div>
				)}

				{order.status !== "delivered" && order.status !== "cancelled" && (
					<div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
						<p>Estimasi sampai: {new Date(estimatedDelivery).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
					</div>
				)}
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				{/* Tracking Timeline */}
				<div className="lg:col-span-2">
					<div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
						<h3 className="mb-6 text-lg font-semibold">Lacak Paket</h3>
						<div className="relative">
							{trackingHistory.map((track, index) => {
								const isActive = index <= currentStatusIndex;
								const isLast = index === trackingHistory.length - 1;
								const isCurrent = track.status === order.status;

								return (
									<div key={index} className="relative flex gap-4 pb-8">
										{!isLast && (
											<div
												className={`absolute left-4 top-10 h-full w-0.5 ${
													isActive ? "bg-orange-500" : "bg-zinc-200 dark:bg-zinc-700"
												}`}
											/>
										)}
										<div
											className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
												isActive
													? "bg-orange-500 text-white"
													: "bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
											}`}
										>
											{isCurrent ? (
												<div className="h-3 w-3 rounded-full bg-white" />
											) : isActive ? (
												<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
													<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
												</svg>
											) : (
												<div className="h-2 w-2 rounded-full bg-current" />
											)}
										</div>
										<div className="flex-1 pb-4">
											<div className={`mb-1 font-medium ${isActive ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400"}`}>
												{track.message}
											</div>
											{track.location && (
												<div className={`mb-1 text-sm ${isActive ? "text-zinc-600 dark:text-zinc-400" : "text-zinc-400"}`}>
													📍 {track.location}
												</div>
											)}
											<div className={`text-xs ${isActive ? "text-zinc-500 dark:text-zinc-500" : "text-zinc-400"}`}>
												{new Date(track.timestamp).toLocaleString("id-ID", {
													year: "numeric",
													month: "long",
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

					{/* Order Items */}
					<div className="mt-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
						<h3 className="mb-4 text-lg font-semibold">Produk Dipesan</h3>
						<div className="space-y-4">
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
										<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
											{formatIDR(item.price)} x {item.quantity}
										</p>
										<p className="mt-1 text-sm font-semibold">
											Subtotal: {formatIDR(item.price * item.quantity)}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Order Info Sidebar */}
				<div className="space-y-6">
					<div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
						<h3 className="mb-4 text-lg font-semibold">Info Pesanan</h3>
						<div className="space-y-3 text-sm">
							<div>
								<p className="text-zinc-600 dark:text-zinc-400">Tanggal Pemesanan</p>
								<p className="font-medium">
									{new Date(order.createdAt).toLocaleDateString("id-ID", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</p>
							</div>
							<div>
								<p className="text-zinc-600 dark:text-zinc-400">Metode Pembayaran</p>
								<p className="font-medium capitalize">
									{order.paymentMethod === "bank_transfer" ? "Transfer Bank" : order.paymentMethod}
								</p>
							</div>
							<div>
								<p className="text-zinc-600 dark:text-zinc-400">Total Pembayaran</p>
								<p className="text-lg font-bold text-orange-500">{formatIDR(order.total)}</p>
							</div>
						</div>
					</div>

					<div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
						<h3 className="mb-4 text-lg font-semibold">Alamat Pengiriman</h3>
						<div className="text-sm">
							<p className="font-medium">{order.shippingAddress.name}</p>
							<p className="mt-1 text-zinc-600 dark:text-zinc-400">{order.shippingAddress.phone}</p>
							<p className="mt-2 text-zinc-600 dark:text-zinc-400">
								{order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}


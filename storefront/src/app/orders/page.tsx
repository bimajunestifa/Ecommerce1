"use client";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Order } from "@/lib/types";
import { formatIDR } from "@/lib/products";
import Link from "next/link";

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

	return (
		<div className="mx-auto max-w-7xl px-4 py-16">
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
									<Link
										href={`/orders/${order.id}`}
										className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
									>
										Lacak Paket
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

"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatIDR } from "@/lib/products";

type Order = {
	id: string;
	userId: string;
	items: Array<{
		productId: string;
		title: string;
		image: string;
		price: number;
		quantity: number;
	}>;
	total: number;
	status: string;
	shippingAddress: {
		name: string;
		phone: string;
		address: string;
		city: string;
		postalCode: string;
	};
	paymentMethod: string;
	createdAt: string;
	updatedAt: string;
};

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

export default function AdminOrdersPage() {
	const { user, loading } = useAuth();
	const router = useRouter();
	const [orders, setOrders] = useState<Order[]>([]);
	const [filterStatus, setFilterStatus] = useState<string>("all");

	useEffect(() => {
		if (!loading && !user) {
			router.push("/login");
		} else if (user && user.role !== "admin") {
			router.push("/");
		}
	}, [user, loading, router]);

	useEffect(() => {
		if (user && user.role === "admin") {
			fetchAllOrders();
		}
	}, [user]);

	const fetchAllOrders = async () => {
		try {
			const res = await fetch("/api/orders/all");
			if (!res.ok) return;
			const data = await res.json();
			setOrders(data.orders || []);
		} catch (error) {
			console.error("Error fetching orders:", error);
		}
	};

	const updateOrderStatus = async (orderId: string, newStatus: string) => {
		try {
			const res = await fetch(`/api/orders/${orderId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: newStatus }),
			});

			if (res.ok) {
				fetchAllOrders();
			}
		} catch (error) {
			console.error("Error updating order:", error);
		}
	};

	if (loading) {
		return <div className="mx-auto max-w-7xl px-4 py-16 text-center">Memuat...</div>;
	}

	if (!user || user.role !== "admin") {
		return null;
	}

	const filteredOrders = filterStatus === "all" 
		? orders 
		: orders.filter(o => o.status === filterStatus);

	return (
		<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Kelola Pesanan</h1>
					<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Lihat dan update status pesanan</p>
				</div>
				<Link href="/admin" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900">
					Kembali ke Admin
				</Link>
			</div>

			<div className="mb-4 grid grid-cols-3 gap-4">
				<Link href="/admin" className="rounded-lg border border-zinc-300 px-4 py-3 text-center hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900">
					Produk
				</Link>
				<Link href="/admin/orders" className="rounded-lg border border-orange-500 bg-orange-50 px-4 py-3 text-center font-semibold text-orange-600 dark:bg-orange-900/20">
					Pesanan
				</Link>
				<Link href="/karyawan" className="rounded-lg border border-zinc-300 px-4 py-3 text-center hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900">
					Karyawan
				</Link>
			</div>

			<div className="mb-4 flex gap-2 overflow-x-auto">
				<button
					onClick={() => setFilterStatus("all")}
					className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
						filterStatus === "all"
							? "bg-orange-500 text-white"
							: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
					}`}
				>
					Semua ({orders.length})
				</button>
				{Object.keys(statusLabels).map((status) => {
					const count = orders.filter(o => o.status === status).length;
					return (
						<button
							key={status}
							onClick={() => setFilterStatus(status)}
							className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
								filterStatus === status
									? "bg-orange-500 text-white"
									: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
							}`}
						>
							{statusLabels[status]} ({count})
						</button>
					);
				})}
			</div>

			{filteredOrders.length === 0 ? (
				<div className="rounded-lg border border-zinc-200 p-16 text-center dark:border-zinc-800">
					<p className="text-zinc-600 dark:text-zinc-400">Tidak ada pesanan</p>
				</div>
			) : (
				<div className="space-y-4">
					{filteredOrders.map((order) => (
						<div key={order.id} className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
							<div className="mb-4 flex items-center justify-between">
								<div>
									<p className="text-sm font-mono text-zinc-600 dark:text-zinc-400">Order ID: {order.id}</p>
									<p className="text-sm text-zinc-600 dark:text-zinc-400">
										{new Date(order.createdAt).toLocaleDateString("id-ID", {
											year: "numeric",
											month: "long",
											day: "numeric",
											hour: "2-digit",
											minute: "2-digit",
										})}
									</p>
								</div>
								<div className="flex items-center gap-3">
									<span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status]}`}>
										{statusLabels[order.status]}
									</span>
									<select
										value={order.status}
										onChange={(e) => updateOrderStatus(order.id, e.target.value)}
										className="rounded-lg border border-zinc-300 bg-white px-3 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
									>
										<option value="pending">Menunggu Pembayaran</option>
										<option value="paid">Sudah Dibayar</option>
										<option value="processing">Diproses</option>
										<option value="shipped">Dikirim</option>
										<option value="delivered">Selesai</option>
										<option value="cancelled">Dibatalkan</option>
									</select>
								</div>
							</div>
							<div className="mb-4 space-y-2">
								{order.items.map((item, idx) => (
									<div key={idx} className="flex gap-4">
										<div className="h-20 w-20 rounded-lg border bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
											{item.image && (
												<img src={item.image} alt={item.title} className="h-full w-full rounded-lg object-cover" />
											)}
										</div>
										<div className="flex-1">
											<h3 className="font-medium">{item.title}</h3>
											<p className="text-sm text-zinc-600 dark:text-zinc-400">
												{formatIDR(item.price)} x {item.quantity}
											</p>
										</div>
									</div>
								))}
							</div>
							<div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
								<p className="mb-2 text-sm font-semibold">Alamat Pengiriman:</p>
								<p className="text-sm">{order.shippingAddress.name}</p>
								<p className="text-sm">{order.shippingAddress.phone}</p>
								<p className="text-sm">{order.shippingAddress.address}</p>
								<p className="text-sm">
									{order.shippingAddress.city}, {order.shippingAddress.postalCode}
								</p>
							</div>
							<div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
								<div>
									<p className="text-sm text-zinc-600 dark:text-zinc-400">Metode Pembayaran: {order.paymentMethod}</p>
									<p className="text-lg font-semibold">Total: {formatIDR(order.total)}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

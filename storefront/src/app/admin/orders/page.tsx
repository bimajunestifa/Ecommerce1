"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatIDR } from "@/lib/products";
import { AdminSidebar } from "@/components/AdminSidebar";
import { ConfirmModal } from "@/components/Modal";

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
	const [searchQuery, setSearchQuery] = useState("");
	const [confirmModal, setConfirmModal] = useState<{
		isOpen: boolean;
		orderId: string;
		newStatus: string;
	}>({ isOpen: false, orderId: "", newStatus: "" });
	const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

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

	const handleStatusChange = (orderId: string, newStatus: string) => {
		setConfirmModal({ isOpen: true, orderId, newStatus });
	};

	const updateOrderStatus = async () => {
		try {
			const res = await fetch(`/api/orders/${confirmModal.orderId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: confirmModal.newStatus }),
			});

			if (res.ok) {
				setToast({ message: "Status pesanan berhasil diupdate", type: "success" });
				fetchAllOrders();
				setTimeout(() => setToast(null), 3000);
			} else {
				setToast({ message: "Gagal mengupdate status pesanan", type: "error" });
				setTimeout(() => setToast(null), 3000);
			}
		} catch (error) {
			console.error("Error updating order:", error);
			setToast({ message: "Terjadi kesalahan saat mengupdate status", type: "error" });
			setTimeout(() => setToast(null), 3000);
		}
	};

	if (loading) {
		return <div className="mx-auto max-w-7xl px-4 py-16 text-center">Memuat...</div>;
	}

	if (!user || user.role !== "admin") {
		return null;
	}

	const filteredOrders = orders.filter((order) => {
		const matchesStatus = filterStatus === "all" || order.status === filterStatus;
		const matchesSearch = searchQuery === "" || 
			order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
			order.shippingAddress.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			order.shippingAddress.phone.includes(searchQuery);
		return matchesStatus && matchesSearch;
	});

	return (
		<div className="flex min-h-screen">
			<AdminSidebar />
			<div className="ml-64 flex-1">
				<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
					<div className="mb-6">
						<h1 className="text-2xl font-bold">Kelola Pesanan</h1>
						<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Lihat dan update status pesanan</p>
					</div>

					{/* Search */}
					<div className="mb-4">
						<input
							type="text"
							placeholder="Cari berdasarkan ID, nama, atau nomor telepon..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
						/>
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
				<div className="rounded-lg border border-zinc-200 bg-white p-16 text-center dark:border-zinc-800 dark:bg-zinc-900">
					<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
						<svg className="h-10 w-10 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
						</svg>
					</div>
					<h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
						{orders.length === 0
							? "Belum ada pesanan"
							: searchQuery || filterStatus !== "all"
							? "Tidak ada pesanan yang sesuai"
							: "Tidak ada pesanan"}
					</h3>
					<p className="text-sm text-zinc-600 dark:text-zinc-400">
						{orders.length === 0
							? "Pesanan akan muncul di sini setelah customer melakukan checkout"
							: searchQuery || filterStatus !== "all"
							? "Coba ubah filter atau kata kunci pencarian"
							: "Tidak ada pesanan dengan status ini"}
					</p>
					{(searchQuery || filterStatus !== "all") && (
						<button
							onClick={() => {
								setSearchQuery("");
								setFilterStatus("all");
							}}
							className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
						>
							Reset Filter
						</button>
					)}
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
										onChange={(e) => handleStatusChange(order.id, e.target.value)}
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
			</div>
		</div>
	);
}

"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatIDR } from "@/lib/products";

type Stats = {
	totalProducts: number;
	totalOrders: number;
	totalUsers: number;
	totalRevenue: number;
	recentOrders: any[];
};

export default function AdminDashboard() {
	const { user, loading: authLoading } = useAuth();
	const router = useRouter();
	const [stats, setStats] = useState<Stats>({
		totalProducts: 0,
		totalOrders: 0,
		totalUsers: 0,
		totalRevenue: 0,
		recentOrders: [],
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!authLoading && (!user || user.role !== "admin")) {
			router.push("/");
			return;
		}

		if (user && user.role === "admin") {
			fetchStats();
		}
	}, [user, authLoading, router]);

	const fetchStats = async () => {
		try {
			// Fetch products
			const productsRes = await fetch("/api/products");
			const products = await productsRes.json();

			// Fetch orders
			const ordersRes = await fetch("/api/orders/all");
			const ordersData = await ordersRes.json();
			const orders = ordersData.orders || [];

			// Fetch users (need to create this endpoint)
			const usersRes = await fetch("/api/admin/users");
			let users = [];
			try {
				const usersData = await usersRes.json();
				users = usersData.users || [];
			} catch {
				// If endpoint doesn't exist, we'll skip it
			}

			const totalRevenue = orders
				.filter((o: any) => o.status === "delivered" || o.status === "paid")
				.reduce((sum: number, o: any) => sum + o.total, 0);

			setStats({
				totalProducts: products.length || 0,
				totalOrders: orders.length || 0,
				totalUsers: users.length || 0,
				totalRevenue,
				recentOrders: orders.slice(0, 5),
			});
		} catch (error) {
			console.error("Error fetching stats:", error);
		} finally {
			setLoading(false);
		}
	};

	if (authLoading || loading) {
		return (
			<div className="mx-auto max-w-7xl px-4 py-16 text-center">
				<p>Memuat...</p>
			</div>
		);
	}

	if (!user || user.role !== "admin") {
		return null;
	}

	return (
		<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
			<div className="mb-6">
				<h1 className="text-2xl font-bold">Dashboard Admin</h1>
				<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Overview sistem ecommerce</p>
			</div>

			{/* Stats Cards */}
			<div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-zinc-600 dark:text-zinc-400">Total Produk</p>
							<p className="mt-1 text-2xl font-bold">{stats.totalProducts}</p>
						</div>
						<div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
							<svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
							</svg>
						</div>
					</div>
					<Link href="/admin/products" className="mt-4 block text-sm text-orange-500 hover:underline">
						Kelola Produk →
					</Link>
				</div>

				<div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-zinc-600 dark:text-zinc-400">Total Pesanan</p>
							<p className="mt-1 text-2xl font-bold">{stats.totalOrders}</p>
						</div>
						<div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
							<svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
							</svg>
						</div>
					</div>
					<Link href="/admin/orders" className="mt-4 block text-sm text-orange-500 hover:underline">
						Kelola Pesanan →
					</Link>
				</div>

				<div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-zinc-600 dark:text-zinc-400">Total User</p>
							<p className="mt-1 text-2xl font-bold">{stats.totalUsers}</p>
						</div>
						<div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/20">
							<svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
							</svg>
						</div>
					</div>
					<Link href="/admin/users" className="mt-4 block text-sm text-orange-500 hover:underline">
						Kelola User →
					</Link>
				</div>

				<div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-zinc-600 dark:text-zinc-400">Total Revenue</p>
							<p className="mt-1 text-2xl font-bold">{formatIDR(stats.totalRevenue)}</p>
						</div>
						<div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900/20">
							<svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
					</div>
					<p className="mt-4 text-xs text-zinc-600 dark:text-zinc-400">Dari pesanan selesai</p>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
				<h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
					<Link
						href="/admin/products/new"
						className="rounded-lg border border-zinc-200 p-4 text-center hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
					>
						<div className="mb-2 text-2xl">➕</div>
						<p className="text-sm font-medium">Tambah Produk</p>
					</Link>
					<Link
						href="/admin/create-account"
						className="rounded-lg border border-zinc-200 p-4 text-center hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
					>
						<div className="mb-2 text-2xl">👤</div>
						<p className="text-sm font-medium">Tambah Karyawan</p>
					</Link>
					<Link
						href="/admin/orders"
						className="rounded-lg border border-zinc-200 p-4 text-center hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
					>
						<div className="mb-2 text-2xl">📦</div>
						<p className="text-sm font-medium">Lihat Pesanan</p>
					</Link>
					<Link
						href="/admin/users"
						className="rounded-lg border border-zinc-200 p-4 text-center hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
					>
						<div className="mb-2 text-2xl">👥</div>
						<p className="text-sm font-medium">Kelola User</p>
					</Link>
				</div>
			</div>

			{/* Recent Orders */}
			<div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-lg font-semibold">Pesanan Terbaru</h2>
					<Link href="/admin/orders" className="text-sm text-orange-500 hover:underline">
						Lihat Semua →
					</Link>
				</div>
				{stats.recentOrders.length === 0 ? (
					<p className="text-center text-sm text-zinc-600 dark:text-zinc-400">Belum ada pesanan</p>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
							<thead>
								<tr>
									<th className="px-4 py-3 text-left text-xs font-semibold uppercase">Order ID</th>
									<th className="px-4 py-3 text-left text-xs font-semibold uppercase">Total</th>
									<th className="px-4 py-3 text-left text-xs font-semibold uppercase">Status</th>
									<th className="px-4 py-3 text-left text-xs font-semibold uppercase">Tanggal</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
								{stats.recentOrders.map((order: any) => (
									<tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
										<td className="px-4 py-3 text-sm font-mono">{order.id.substring(0, 8)}...</td>
										<td className="px-4 py-3 text-sm font-semibold">{formatIDR(order.total)}</td>
										<td className="px-4 py-3 text-sm">
											<span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
												{order.status}
											</span>
										</td>
										<td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
											{new Date(order.createdAt).toLocaleDateString("id-ID")}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}

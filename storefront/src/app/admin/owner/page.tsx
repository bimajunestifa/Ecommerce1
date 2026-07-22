"use client";

import { AdminSidebar } from "@/components/AdminSidebar";
import { getCmsProducts } from "@/lib/localCms";
import { getLocalOrders } from "@/lib/localOrders";
import { formatIDR } from "@/lib/products";
import type { Order } from "@/lib/types";
import { useMemo, useSyncExternalStore } from "react";

const subscribeHydration = () => () => {};

const statusMeta = [
	{ key: "pending", label: "Menunggu", color: "#f59e0b" },
	{ key: "paid", label: "Dibayar", color: "#3b82f6" },
	{ key: "processing", label: "Diproses", color: "#8b5cf6" },
	{ key: "shipped", label: "Dikirim", color: "#6366f1" },
	{ key: "delivered", label: "Selesai", color: "#22c55e" },
	{ key: "cancelled", label: "Batal", color: "#ef4444" },
] as const;

export default function OwnerAnalyticsPage() {
	const hydrated = useSyncExternalStore(subscribeHydration, () => true, () => false);
	const orders = useMemo<Order[]>(() => hydrated ? getLocalOrders() : [], [hydrated]);
	const products = useMemo(() => hydrated ? getCmsProducts() : [], [hydrated]);
	const analytics = useMemo(() => {
		const validOrders = orders.filter((order) => order.status !== "cancelled");
		const revenue = validOrders.filter((order) => ["paid", "processing", "shipped", "delivered"].includes(order.status)).reduce((sum, order) => sum + order.total, 0);
		const today = new Date();
		const daily = Array.from({ length: 7 }, (_, index) => {
			const date = new Date(today);
			date.setDate(today.getDate() - (6 - index));
			const key = date.toISOString().slice(0, 10);
			const dayOrders = validOrders.filter((order) => order.createdAt.slice(0, 10) === key);
			return { key, label: date.toLocaleDateString("id-ID", { weekday: "short" }), revenue: dayOrders.reduce((sum, order) => sum + order.total, 0), count: dayOrders.length };
		});
		const status = statusMeta.map((item) => ({ ...item, count: orders.filter((order) => order.status === item.key).length }));
		const average = validOrders.length ? validOrders.reduce((sum, order) => sum + order.total, 0) / validOrders.length : 0;
		return { revenue, daily, status, average, validOrders };
	}, [orders]);
	const maxRevenue = Math.max(...analytics.daily.map((day) => day.revenue), 1);
	const totalStatuses = Math.max(orders.length, 1);
	const donutSegments = analytics.status.map((item, index, statuses) => {
		const start = statuses.slice(0, index).reduce((sum, status) => sum + (status.count / totalStatuses) * 100, 0);
		const end = start + (item.count / totalStatuses) * 100;
		return `${item.color} ${start}% ${end}%`;
	});
	const donut = `conic-gradient(${orders.length ? donutSegments.join(", ") : "#e4e4e7 0% 100%"})`;

	return (
		<div className="min-h-screen bg-zinc-50 dark:bg-zinc-950"><AdminSidebar /><main className="ml-64 px-6 py-10"><div className="mx-auto max-w-7xl">
			<div className="mb-8 flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">Owner Control Center</p><h1 className="mt-2 text-3xl font-bold">Analitik Bisnis</h1><p className="mt-1 text-sm text-zinc-500">Ringkasan performa toko dan tren transaksi tujuh hari terakhir.</p></div><div className="rounded-xl border bg-white px-4 py-2 text-sm dark:border-zinc-800 dark:bg-black"><span className="mr-2 text-green-500">●</span>Data terkini</div></div>
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<Metric label="Omzet Terverifikasi" value={formatIDR(analytics.revenue)} note="Pesanan dibayar dan diproses" color="orange" />
				<Metric label="Total Pesanan" value={String(orders.length)} note={`${analytics.validOrders.length} pesanan aktif`} color="blue" />
				<Metric label="Rata-rata Transaksi" value={formatIDR(analytics.average)} note="Nilai per pesanan aktif" color="purple" />
				<Metric label="Produk CMS" value={String(products.length)} note={`${products.filter((product) => product.stock < 10).length} stok menipis`} color="green" />
			</div>

			<div className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
				<section className="rounded-2xl border bg-white p-6 dark:border-zinc-800 dark:bg-black"><div className="mb-8 flex justify-between"><div><h2 className="text-lg font-bold">Grafik Omzet 7 Hari</h2><p className="text-sm text-zinc-500">Nilai transaksi harian</p></div><span className="text-sm font-semibold text-orange-600">{formatIDR(analytics.daily.reduce((sum, day) => sum + day.revenue, 0))}</span></div><div className="flex h-72 items-end gap-3 border-b border-zinc-200 px-2 dark:border-zinc-800">{analytics.daily.map((day) => <div key={day.key} className="group flex h-full flex-1 flex-col justify-end"><div className="relative mx-auto w-full max-w-14 rounded-t-lg bg-gradient-to-t from-orange-600 to-orange-400 transition hover:from-orange-500" style={{ height: `${Math.max(day.revenue ? 8 : 2, (day.revenue / maxRevenue) * 88)}%` }}><div className="pointer-events-none absolute -top-12 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-2 py-1 text-xs text-white group-hover:block">{formatIDR(day.revenue)} · {day.count} order</div></div><div className="mt-3 text-center text-xs font-medium text-zinc-500">{day.label}</div></div>)}</div></section>
				<section className="rounded-2xl border bg-white p-6 dark:border-zinc-800 dark:bg-black"><h2 className="text-lg font-bold">Status Pesanan</h2><p className="text-sm text-zinc-500">Distribusi seluruh transaksi</p><div className="relative mx-auto my-8 h-44 w-44 rounded-full" style={{ background: donut }}><div className="absolute inset-8 grid place-items-center rounded-full bg-white text-center dark:bg-black"><div><div className="text-3xl font-bold">{orders.length}</div><div className="text-xs text-zinc-500">Pesanan</div></div></div></div><div className="grid grid-cols-2 gap-3">{analytics.status.map((item) => <div key={item.key} className="flex items-center justify-between text-sm"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />{item.label}</span><strong>{item.count}</strong></div>)}</div></section>
			</div>

			<section className="mt-6 rounded-2xl border bg-white p-6 dark:border-zinc-800 dark:bg-black"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-bold">Transaksi Terbaru</h2><p className="text-sm text-zinc-500">Lima pesanan paling baru</p></div><a href="/admin/orders" className="text-sm font-semibold text-orange-600">Kelola Pesanan →</a></div>{orders.length === 0 ? <div className="rounded-xl bg-zinc-50 py-12 text-center text-sm text-zinc-500 dark:bg-zinc-900">Belum ada data transaksi. Lakukan checkout untuk melihat grafik.</div> : <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="border-b text-left text-xs uppercase text-zinc-500 dark:border-zinc-800"><tr><th className="py-3">Order ID</th><th>Pelanggan</th><th>Status</th><th>Tanggal</th><th className="text-right">Total</th></tr></thead><tbody>{orders.slice(0, 5).map((order) => <tr key={order.id} className="border-b last:border-0 dark:border-zinc-800"><td className="py-4 font-mono">{order.id}</td><td>{order.shippingAddress.name}</td><td><span className="rounded-full bg-zinc-100 px-2 py-1 text-xs capitalize dark:bg-zinc-900">{order.status}</span></td><td>{new Date(order.createdAt).toLocaleDateString("id-ID")}</td><td className="text-right font-semibold">{formatIDR(order.total)}</td></tr>)}</tbody></table></div>}</section>
		</div></main></div>
	);
}

function Metric({ label, value, note, color }: { label: string; value: string; note: string; color: "orange" | "blue" | "purple" | "green" }) {
	const colors = { orange: "bg-orange-100 text-orange-600", blue: "bg-blue-100 text-blue-600", purple: "bg-purple-100 text-purple-600", green: "bg-green-100 text-green-600" };
	return <div className="rounded-2xl border bg-white p-5 dark:border-zinc-800 dark:bg-black"><div className={`mb-4 h-2 w-12 rounded-full ${colors[color]}`} /><p className="text-sm text-zinc-500">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p><p className="mt-2 text-xs text-zinc-500">{note}</p></div>;
}

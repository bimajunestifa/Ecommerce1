"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

export function KaryawanSidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const { user, refresh } = useAuth();

	const handleLogout = async () => {
		try {
			const res = await fetch("/api/auth/logout", { 
				method: "POST",
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (res.ok) {
				await refresh();
				window.location.href = "/";
			} else {
				console.error("Logout failed:", await res.text());
				await refresh();
				window.location.href = "/";
			}
		} catch (error) {
			console.error("Error during logout:", error);
			await refresh();
			window.location.href = "/";
		}
	};

	const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/");

	const menuItems = [
		{
			href: "/karyawan",
			label: "Pesanan",
			icon: (
				<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
				</svg>
			),
		},
		{
			href: "/karyawan/products",
			label: "Produk",
			icon: (
				<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
				</svg>
			),
		},
	];

	return (
		<aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
			<div className="flex h-full flex-col">
				{/* Header */}
				<div className="border-b border-zinc-200 p-6 dark:border-zinc-800">
					<Link href="/karyawan" className="flex items-center gap-2">
						<div className="rounded-lg bg-blue-500 p-2">
							<svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
						</div>
						<div>
							<h1 className="text-lg font-bold">Panel Karyawan</h1>
							<p className="text-xs text-zinc-600 dark:text-zinc-400">{user?.name || "Karyawan"}</p>
						</div>
					</Link>
				</div>

				{/* Navigation */}
				<nav className="flex-1 space-y-1 p-4">
					{menuItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
								isActive(item.href)
									? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
									: "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
							}`}
						>
							{item.icon}
							{item.label}
						</Link>
					))}
				</nav>

				{/* Footer */}
				<div className="border-t border-zinc-200 p-4 space-y-2 dark:border-zinc-800">
					<Link
						href="/"
						className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
					>
						<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						Kembali ke Toko
					</Link>
					<button
						onClick={handleLogout}
						className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
					>
						<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
						</svg>
						Logout
					</button>
				</div>
			</div>
		</aside>
	);
}


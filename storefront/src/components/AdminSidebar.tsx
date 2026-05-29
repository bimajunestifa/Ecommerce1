"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

export function AdminSidebar() {
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
			href: "/admin/dashboard",
			label: "Dashboard",
			icon: (
				<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
				</svg>
			),
		},
		{
			href: "/admin/products",
			label: "Produk",
			icon: (
				<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
				</svg>
			),
		},
		{
			href: "/admin/orders",
			label: "Pesanan",
			icon: (
				<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
				</svg>
			),
		},
		{
			href: "/admin/users",
			label: "User & Karyawan",
			icon: (
				<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
				</svg>
			),
		},
		{
			href: "/admin/create-account",
			label: "Buat Akun",
			icon: (
				<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
				</svg>
			),
		},
	];

	return (
		<aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
			<div className="flex h-full flex-col">
				{/* Header */}
				<div className="border-b border-zinc-200 p-6 dark:border-zinc-800">
					<Link href="/admin" className="flex items-center gap-2">
						<div className="rounded-lg bg-orange-500 p-2">
							<svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<div>
							<h1 className="text-lg font-bold">Admin Panel</h1>
							<p className="text-xs text-zinc-600 dark:text-zinc-400">{user?.name || "Admin"}</p>
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
									? "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
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


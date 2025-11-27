"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";
import { useCart } from "./cart/CartContext";

export default function Navbar() {
	const [open, setOpen] = useState(false);
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const { user, refresh } = useAuth();
	const router = useRouter();
	const { items } = useCart();
	const userMenuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
				setUserMenuOpen(false);
			}
		}

		if (userMenuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [userMenuOpen]);

	const handleLogout = async () => {
		await fetch("/api/auth/logout", { method: "POST" });
		refresh();
		router.push("/");
		setUserMenuOpen(false);
	};

	return (
		<header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-black/60">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<Link href="/" className="text-xl font-bold tracking-tight">
					<span className="text-black dark:text-white">Bima</span>
					<span className="text-zinc-500">Store</span>
				</Link>
				<nav className="hidden gap-8 text-sm font-medium md:flex">
					<Link href="/" className="hover:opacity-80">Beranda</Link>
					<Link href="/men" className="hover:opacity-80">Pria</Link>
					<Link href="/women" className="hover:opacity-80">Wanita</Link>
					<Link href="/kids" className="hover:opacity-80">Anak</Link>
					<Link href="/sale" className="hover:opacity-80">Sale</Link>
				</nav>
				<div className="flex items-center gap-4">
					<Link href="/search" aria-label="Search" className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
					</Link>
					{user && (
						<Link href="/wishlist" aria-label="Wishlist" className="relative rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"></path></svg>
						</Link>
					)}
					<Link href="/cart" aria-label="Cart" className="relative rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.4 12.1a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6l1.2-6.5H6.65"></path></svg>
						{items.length > 0 && (
							<span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
								{items.length}
							</span>
						)}
					</Link>
					{user ? (
						<div className="relative" ref={userMenuRef}>
							<button
								onClick={() => setUserMenuOpen(!userMenuOpen)}
								className="flex items-center gap-2 rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
							>
								<div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
									{user.name.charAt(0).toUpperCase()}
								</div>
							</button>
							{userMenuOpen && (
								<div className="absolute right-0 mt-2 w-48 rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900 z-50">
									<Link href="/profile" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
										Profile
									</Link>
									<Link href="/orders" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
										Pesanan Saya
									</Link>
									<Link href="/wishlist" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
										Wishlist
									</Link>
									{(user.role === "admin" || user.role === "karyawan") && (
										<>
											{user.role === "admin" && (
												<Link href="/admin" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
													Admin Panel
												</Link>
											)}
											<Link href="/karyawan" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
												Panel Karyawan
											</Link>
										</>
									)}
									<button
										onClick={handleLogout}
										className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
									>
										Logout
									</button>
								</div>
							)}
						</div>
					) : (
						<Link href="/login" className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
							Masuk
						</Link>
					)}
					<button onClick={() => setOpen(!open)} className="rounded md:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900" aria-label="Toggle menu">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
					</button>
				</div>
			</div>
			{open && (
				<div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
					<nav className="mx-auto flex max-w-7xl flex-col p-4 text-sm">
						<Link href="/" className="py-2">Beranda</Link>
						<Link href="/men" className="py-2">Pria</Link>
						<Link href="/women" className="py-2">Wanita</Link>
						<Link href="/kids" className="py-2">Anak</Link>
						<Link href="/sale" className="py-2">Sale</Link>
					</nav>
				</div>
			)}
		</header>
	);
}



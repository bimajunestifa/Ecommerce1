"use client";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
	const { user, loading } = useAuth();
	const router = useRouter();
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");

	useEffect(() => {
		if (!loading && !user) {
			router.push("/login");
		} else if (user) {
			setName(user.name);
			setPhone(user.phone || "");
		}
	}, [user, loading, router]);

	if (loading) {
		return <div className="mx-auto max-w-4xl px-4 py-16 text-center">Memuat...</div>;
	}

	if (!user) {
		return null;
	}

	return (
		<div className="mx-auto max-w-4xl px-4 py-16">
			<h1 className="mb-8 text-3xl font-bold">Profile Saya</h1>
			<div className="grid gap-8 md:grid-cols-3">
				<div className="md:col-span-1">
					<div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
						<div className="mb-4 flex justify-center">
							<div className="h-24 w-24 rounded-full bg-orange-500 flex items-center justify-center text-4xl font-bold text-white">
								{user.name.charAt(0).toUpperCase()}
							</div>
						</div>
						<h2 className="text-center text-xl font-semibold">{user.name}</h2>
						<p className="text-center text-sm text-zinc-600 dark:text-zinc-400">{user.email}</p>
					</div>
					<nav className="mt-4 space-y-2">
						<Link href="/profile" className="block rounded-lg bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600 dark:bg-orange-900/20">
							Profile
						</Link>
						<Link href="/orders" className="block rounded-lg px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900">
							Pesanan Saya
						</Link>
						<Link href="/wishlist" className="block rounded-lg px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900">
							Wishlist
						</Link>
					</nav>
				</div>
				<div className="md:col-span-2">
					<div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
						<h2 className="mb-4 text-xl font-semibold">Informasi Akun</h2>
						<form className="space-y-4">
							<div>
								<label className="mb-1 block text-sm font-medium">Nama</label>
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
								/>
							</div>
							<div>
								<label className="mb-1 block text-sm font-medium">Email</label>
								<input
									type="email"
									value={user.email}
									disabled
									className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-800"
								/>
							</div>
							<div>
								<label className="mb-1 block text-sm font-medium">No. Telepon</label>
								<input
									type="tel"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									className="w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
								/>
							</div>
							<button
								type="button"
								className="rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600"
							>
								Simpan Perubahan
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

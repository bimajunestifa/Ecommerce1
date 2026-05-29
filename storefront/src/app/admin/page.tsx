"use client";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useEffect, useState } from "react";

type AdminUser = {
	id: string;
	email: string;
	name: string;
	role: string;
	createdAt: string;
};

export default function Admin() {
	const { user, loading } = useAuth();
	const router = useRouter();
	const [users, setUsers] = useState<AdminUser[]>([]);
	const [usersLoading, setUsersLoading] = useState(true);
	const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
	const [usersError, setUsersError] = useState("");

	useEffect(() => {
		if (!loading && (!user || user.role !== "admin")) {
			router.push("/");
		}

		if (user?.role === "admin") {
			void fetchUsers();
		}
	}, [user, loading, router]);

	const fetchUsers = async () => {
		setUsersLoading(true);
		setUsersError("");

		try {
			const res = await fetch("/api/admin/users", {
				cache: "no-store",
				credentials: "include",
			});

			if (!res.ok) {
				setUsersError("Gagal memuat daftar akun");
				return;
			}

			const data = await res.json();
			setUsers(data.users || []);
		} catch (error) {
			console.error("Error fetching users:", error);
			setUsersError("Terjadi kesalahan saat memuat daftar akun");
		} finally {
			setUsersLoading(false);
		}
	};

	const handleDeleteUser = async (userId: string, userName: string) => {
		if (!confirm(`Hapus akun ${userName}?`)) return;

		setDeleteLoadingId(userId);
		setUsersError("");

		try {
			const res = await fetch(`/api/admin/users/${userId}`, {
				method: "DELETE",
				credentials: "include",
			});

			const data = await res.json().catch(() => null);

			if (!res.ok) {
				setUsersError(data?.error || "Gagal menghapus akun");
				return;
			}

			setUsers((currentUsers) => currentUsers.filter((currentUser) => currentUser.id !== userId));
		} catch (error) {
			console.error("Error deleting user:", error);
			setUsersError("Terjadi kesalahan saat menghapus akun");
		} finally {
			setDeleteLoadingId(null);
		}
	};

	if (loading) {
		return (
			<div className="mx-auto max-w-7xl px-4 py-16 text-center">
				<p>Memuat...</p>
			</div>
		);
	}

	if (!user || user.role !== "admin") {
		return null;
	}

	const roleColors: Record<string, string> = {
		admin: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300",
		karyawan: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
		user: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300",
	};

	return (
		<div className="flex min-h-screen">
			<AdminSidebar />
			<div className="ml-64 flex-1">
				<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
					<div className="mb-6">
						<h1 className="text-2xl font-bold">Admin Panel</h1>
						<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Kelola semua aspek ecommerce</p>
					</div>

					<div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
						<Link
							href="/admin/dashboard"
							className="rounded-lg border border-orange-500 bg-orange-50 px-4 py-3 text-center font-semibold text-orange-600 dark:bg-orange-900/20"
						>
							Dashboard
						</Link>
						<Link
							href="/admin/products"
							className="rounded-lg border border-zinc-300 px-4 py-3 text-center hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
						>
							Produk
						</Link>
						<Link
							href="/admin/orders"
							className="rounded-lg border border-zinc-300 px-4 py-3 text-center hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
						>
							Pesanan
						</Link>
						<Link
							href="/admin/users"
							className="rounded-lg border border-zinc-300 px-4 py-3 text-center hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
						>
							User/Karyawan
						</Link>
					</div>

					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<Link
							href="/admin/products"
							className="rounded-lg border border-zinc-200 p-6 hover:shadow-lg dark:border-zinc-800"
						>
							<div className="mb-4 flex items-center gap-3">
								<div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
									<svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
									</svg>
								</div>
								<h2 className="text-lg font-semibold">Kelola Produk</h2>
							</div>
							<p className="text-sm text-zinc-600 dark:text-zinc-400">Tambah, edit, dan hapus produk</p>
						</Link>

						<Link
							href="/admin/orders"
							className="rounded-lg border border-zinc-200 p-6 hover:shadow-lg dark:border-zinc-800"
						>
							<div className="mb-4 flex items-center gap-3">
								<div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
									<svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
									</svg>
								</div>
								<h2 className="text-lg font-semibold">Kelola Pesanan</h2>
							</div>
							<p className="text-sm text-zinc-600 dark:text-zinc-400">Lihat dan update status pesanan</p>
						</Link>

						<Link
							href="/admin/users"
							className="rounded-lg border border-zinc-200 p-6 hover:shadow-lg dark:border-zinc-800"
						>
							<div className="mb-4 flex items-center gap-3">
								<div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/20">
									<svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
									</svg>
								</div>
								<h2 className="text-lg font-semibold">Kelola User & Karyawan</h2>
							</div>
							<p className="text-sm text-zinc-600 dark:text-zinc-400">Lihat dan kelola semua user dan karyawan</p>
						</Link>

						<Link
							href="/admin/create-account"
							className="rounded-lg border border-zinc-200 p-6 hover:shadow-lg dark:border-zinc-800"
						>
							<div className="mb-4 flex items-center gap-3">
								<div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900/20">
									<svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
									</svg>
								</div>
								<h2 className="text-lg font-semibold">Buat Akun Baru</h2>
							</div>
							<p className="text-sm text-zinc-600 dark:text-zinc-400">Buat akun admin atau karyawan baru</p>
						</Link>
					</div>

					<div className="mt-8 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
						<div className="mb-4 flex items-center justify-between gap-4">
							<div>
								<h2 className="text-lg font-semibold">Daftar Akun Terdaftar</h2>
								<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
									Lihat akun yang sudah mendaftar dan hapus akun bila diperlukan.
								</p>
							</div>
							<Link
								href="/admin/users"
								className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
							>
								Lihat Semua
							</Link>
						</div>

						{usersError && (
							<div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-300">
								{usersError}
							</div>
						)}

						{usersLoading ? (
							<div className="py-10 text-center text-sm text-zinc-600 dark:text-zinc-400">
								Memuat daftar akun...
							</div>
						) : users.length === 0 ? (
							<div className="py-10 text-center text-sm text-zinc-600 dark:text-zinc-400">
								Belum ada akun yang terdaftar.
							</div>
						) : (
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
									<thead>
										<tr>
											<th className="px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500">Nama</th>
											<th className="px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500">Email</th>
											<th className="px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500">Role</th>
											<th className="px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500">Tanggal</th>
											<th className="px-4 py-3 text-right text-xs font-semibold uppercase text-zinc-500">Aksi</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
										{users.map((account) => (
											<tr key={account.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/60">
												<td className="px-4 py-3">
													<div className="flex items-center gap-3">
														<div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 font-semibold text-white">
															{account.name.charAt(0).toUpperCase()}
														</div>
														<div>
															<p className="font-medium text-zinc-900 dark:text-zinc-100">{account.name}</p>
															<p className="text-xs text-zinc-500 dark:text-zinc-400">ID: {account.id}</p>
														</div>
													</div>
												</td>
												<td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">{account.email}</td>
												<td className="px-4 py-3">
													<span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${roleColors[account.role] || roleColors.user}`}>
														{account.role}
													</span>
												</td>
												<td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
													{new Date(account.createdAt).toLocaleDateString("id-ID")}
												</td>
												<td className="px-4 py-3 text-right">
													{account.id === user.id ? (
														<span className="text-xs text-zinc-400">Akun aktif</span>
													) : (
														<button
															onClick={() => void handleDeleteUser(account.id, account.name)}
															disabled={deleteLoadingId === account.id}
															className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-900/20"
														>
															{deleteLoadingId === account.id ? "Menghapus..." : "Hapus"}
														</button>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}



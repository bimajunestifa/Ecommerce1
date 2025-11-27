"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

type User = {
	id: string;
	email: string;
	name: string;
	role: string;
	createdAt: string;
};

export default function AdminUsersPage() {
	const { user, loading: authLoading } = useAuth();
	const router = useRouter();
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!authLoading && (!user || user.role !== "admin")) {
			router.push("/");
			return;
		}

		if (user && user.role === "admin") {
			fetchUsers();
		}
	}, [user, authLoading, router]);

	const fetchUsers = async () => {
		try {
			const res = await fetch("/api/admin/users");
			if (res.ok) {
				const data = await res.json();
				setUsers(data.users || []);
			}
		} catch (error) {
			console.error("Error fetching users:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (userId: string) => {
		if (!confirm("Yakin ingin menghapus user ini?")) return;

		try {
			const res = await fetch(`/api/admin/users/${userId}`, {
				method: "DELETE",
			});

			if (res.ok) {
				fetchUsers();
			} else {
				alert("Gagal menghapus user");
			}
		} catch (error) {
			console.error("Error deleting user:", error);
			alert("Terjadi kesalahan");
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

	const roleColors: Record<string, string> = {
		admin: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
		karyawan: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
		user: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
	};

	return (
		<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Kelola User</h1>
					<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Lihat dan kelola semua user</p>
				</div>
				<Link
					href="/admin/create-account"
					className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
				>
					+ Tambah User/Karyawan
				</Link>
			</div>

			{users.length === 0 ? (
				<div className="rounded-lg border border-zinc-200 p-16 text-center dark:border-zinc-800">
					<p className="text-zinc-600 dark:text-zinc-400">Belum ada user</p>
				</div>
			) : (
				<div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
					<table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
						<thead className="bg-zinc-50 dark:bg-zinc-900">
							<tr>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase">Nama</th>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase">Email</th>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase">Role</th>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase">Tanggal Daftar</th>
								<th className="px-4 py-3 text-right text-xs font-semibold uppercase">Aksi</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
							{users.map((u) => (
								<tr key={u.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
									<td className="px-4 py-3">
										<div className="flex items-center gap-3">
											<div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
												{u.name.charAt(0).toUpperCase()}
											</div>
											<p className="font-medium">{u.name}</p>
										</div>
									</td>
									<td className="px-4 py-3 text-sm">{u.email}</td>
									<td className="px-4 py-3">
										<span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${roleColors[u.role] || roleColors.user}`}>
											{u.role}
										</span>
									</td>
									<td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
										{new Date(u.createdAt).toLocaleDateString("id-ID")}
									</td>
									<td className="px-4 py-3 text-right">
										{u.id !== user.id && (
											<button
												onClick={() => handleDelete(u.id)}
												className="rounded px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
											>
												Hapus
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
	);
}

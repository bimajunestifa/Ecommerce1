"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import Link from "next/link";

export default function CreateAccountPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState<"admin" | "karyawan" | "user">("user");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { user } = useAuth();

	// Redirect jika bukan admin
	if (user && user.role !== "admin") {
		router.push("/");
		return null;
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setLoading(true);

		try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password, role }),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.error || "Gagal membuat akun");
				return;
			}

			setSuccess(`Akun ${role} berhasil dibuat! Email: ${email}`);
			setName("");
			setEmail("");
			setPassword("");
			setRole("user");
		} catch (err) {
			setError("Terjadi kesalahan");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mx-auto max-w-md px-4 py-16">
			<div className="mb-4">
				<Link href="/admin" className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
					← Kembali ke Admin Panel
				</Link>
			</div>
			<h1 className="mb-8 text-3xl font-bold">Buat Akun Baru</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				{error && <div className="rounded bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</div>}
				{success && <div className="rounded bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">{success}</div>}
				
				<div>
					<label htmlFor="name" className="mb-1 block text-sm font-medium">
						Nama
					</label>
					<input
						id="name"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						className="w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
					/>
				</div>
				<div>
					<label htmlFor="email" className="mb-1 block text-sm font-medium">
						Email
					</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
					/>
				</div>
				<div>
					<label htmlFor="password" className="mb-1 block text-sm font-medium">
						Password
					</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						minLength={6}
						className="w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
					/>
				</div>
				<div>
					<label htmlFor="role" className="mb-1 block text-sm font-medium">
						Role
					</label>
					<select
						id="role"
						value={role}
						onChange={(e) => setRole(e.target.value as "admin" | "karyawan" | "user")}
						className="w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
					>
						<option value="user">User (Customer)</option>
						<option value="karyawan">Karyawan</option>
						<option value="admin">Admin</option>
					</select>
					<p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
						Admin: Akses penuh ke semua fitur. Karyawan: Kelola pesanan dan produk.
					</p>
				</div>
				<button
					type="submit"
					disabled={loading}
					className="w-full rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
				>
					{loading ? "Memproses..." : "Buat Akun"}
				</button>
			</form>
		</div>
	);
}

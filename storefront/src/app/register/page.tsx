"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";

export default function RegisterPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { refresh } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password }),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.error || "Registrasi gagal");
				return;
			}

			// Auto login setelah register
			const loginRes = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			if (loginRes.ok) {
				// Refresh auth context untuk update user state
				await refresh();
				// Tunggu sebentar agar state ter-update
				setTimeout(() => {
					router.push("/");
					router.refresh();
				}, 100);
			} else {
				router.push("/login");
			}
		} catch (err) {
			setError("Terjadi kesalahan");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mx-auto max-w-md px-4 py-16">
			<h1 className="mb-8 text-3xl font-bold">Daftar</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				{error && <div className="rounded bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</div>}
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
				<button
					type="submit"
					disabled={loading}
					className="w-full rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
				>
					{loading ? "Memproses..." : "Daftar"}
				</button>
			</form>
			<p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
				Sudah punya akun?{" "}
				<Link href="/login" className="font-semibold text-orange-500 hover:underline">
					Masuk
				</Link>
			</p>
		</div>
	);
}

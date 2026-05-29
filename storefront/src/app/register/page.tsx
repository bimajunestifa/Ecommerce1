"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleRequestOtp = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const res = await fetch("/api/auth/register/request-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password }),
			});

			// Cek content type sebelum parse JSON
			const contentType = res.headers.get("content-type");
			if (!contentType || !contentType.includes("application/json")) {
				const text = await res.text();
				console.error("Non-JSON response:", text.substring(0, 200));
				setError("Server mengembalikan response yang tidak valid");
				setLoading(false);
				return;
			}

			const data = await res.json();

			if (!res.ok) {
				const errorMsg = data.error || data.details || "Registrasi gagal";
				console.error("Register request OTP error:", errorMsg, data);
				setError(errorMsg);
				setLoading(false);
				return;
			}

			sessionStorage.setItem(
				"pending-register",
				JSON.stringify({
					name,
					email,
					password,
					expiresAt: data.expiresAt,
				}),
			);
			router.push(`/register/verify?email=${encodeURIComponent(email)}`);
		} catch (err) {
			console.error("Register request OTP catch error:", err);
			setError(err instanceof Error ? err.message : "Terjadi kesalahan");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mx-auto max-w-md px-4 py-16">
			<h1 className="mb-2 text-3xl font-bold">Daftar</h1>
			<p className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">
				Masukkan data akun Anda. Setelah itu kami kirim OTP verifikasi ke email.
			</p>
			<form onSubmit={handleRequestOtp} className="space-y-4">
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
					{loading ? "Memproses..." : "Kirim OTP"}
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

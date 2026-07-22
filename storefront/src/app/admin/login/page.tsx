"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function OwnerLoginForm() {
	const searchParams = useSearchParams();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	async function submit(event: React.FormEvent) {
		event.preventDefault();
		setLoading(true);
		setError("");
		try {
			const response = await fetch("/api/owner/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
			const data = await response.json();
			if (!response.ok) throw new Error(data.error || "Login gagal");
			const requested = searchParams.get("next");
			window.location.href = requested?.startsWith("/admin") && !requested.startsWith("/admin/login") ? requested : "/admin/owner";
		} catch (reason) {
			setError(reason instanceof Error ? reason.message : "Login gagal");
		} finally { setLoading(false); }
	}

	return (
		<div className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 shadow-2xl dark:bg-zinc-950">
			<div className="mb-8"><div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-orange-500 font-black text-white">B</div><p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">Area Terproteksi</p><h1 className="mt-2 text-3xl font-bold">Login Owner</h1><p className="mt-2 text-sm text-zinc-500">Masuk untuk mengelola operasional dan laporan BimaStore.</p></div>
			<form onSubmit={submit} className="space-y-5">
				{error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
				<label className="block text-sm font-semibold">Email Owner<input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-zinc-700 dark:bg-black" placeholder="owner@bimastore.id" /></label>
				<label className="block text-sm font-semibold">Password<div className="relative mt-2"><input type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-zinc-300 px-4 py-3 pr-20 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-zinc-700 dark:bg-black" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-500">{showPassword ? "Sembunyikan" : "Lihat"}</button></div></label>
				<button disabled={loading} className="w-full rounded-xl bg-orange-500 px-5 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 disabled:opacity-50">{loading ? "Memverifikasi..." : "Masuk ke Dashboard"}</button>
			</form>
			<div className="mt-6 flex items-center gap-2 text-xs text-zinc-500"><span className="text-green-500">●</span> Sesi terenkripsi dan berakhir otomatis dalam 4 jam</div>
		</div>
	);
}

export default function OwnerLoginPage() {
	return <main className="grid min-h-screen place-items-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-orange-950 px-4"><Suspense fallback={<div className="text-white">Memuat...</div>}><OwnerLoginForm /></Suspense></main>;
}

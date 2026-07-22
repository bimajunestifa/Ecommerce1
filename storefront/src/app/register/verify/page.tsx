"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

type PendingRegister = {
	name: string;
	email: string;
	password: string;
	expiresAt: string;
};

function formatRemaining(ms: number) {
	const totalSeconds = Math.max(0, Math.floor(ms / 1000));
	const minutes = Math.floor(totalSeconds / 60)
		.toString()
		.padStart(2, "0");
	const seconds = (totalSeconds % 60).toString().padStart(2, "0");

	return `${minutes}:${seconds}`;
}

function RegisterVerifyContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { refresh } = useAuth();
	const [otp, setOtp] = useState("");
	const [pending, setPending] = useState<PendingRegister | null>(null);
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [remainingMs, setRemainingMs] = useState(0);
	const emailFromQuery = searchParams.get("email");

	useEffect(() => {
		const raw = sessionStorage.getItem("pending-register");
		if (!raw) {
			router.replace("/register");
			return;
		}

		try {
			const parsed = JSON.parse(raw) as PendingRegister;
			if (!parsed.email || !parsed.name || !parsed.password || !parsed.expiresAt) {
				sessionStorage.removeItem("pending-register");
				router.replace("/register");
				return;
			}

			if (emailFromQuery && parsed.email !== emailFromQuery) {
				router.replace("/register");
				return;
			}

			setPending(parsed);
			setMessage(`Kode OTP sudah dikirim ke ${parsed.email}.`);
		} catch {
			sessionStorage.removeItem("pending-register");
			router.replace("/register");
		}
	}, [emailFromQuery, router]);

	useEffect(() => {
		if (!pending) return;

		const tick = () => {
			const next = new Date(pending.expiresAt).getTime() - Date.now();
			setRemainingMs(Math.max(0, next));
		};

		tick();
		const interval = window.setInterval(tick, 1000);
		return () => window.clearInterval(interval);
	}, [pending]);

	const isExpired = remainingMs <= 0;
	const timerLabel = useMemo(() => formatRemaining(remainingMs), [remainingMs]);

	const handleVerify = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!pending) return;

		setError("");
		setMessage("");
		setLoading(true);

		try {
			const res = await fetch("/api/auth/register/verify-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: pending.name,
					email: pending.email,
					password: pending.password,
					otp,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.error || data.details || "Verifikasi OTP gagal");
				return;
			}

			sessionStorage.removeItem("pending-register");
			await refresh();
			await new Promise((resolve) => setTimeout(resolve, 500));
			window.location.href = "/";
		} catch (err) {
			console.error("Register verify OTP catch error:", err);
			setError(err instanceof Error ? err.message : "Terjadi kesalahan");
		} finally {
			setLoading(false);
		}
	};

	const handleResend = async () => {
		if (!pending) return;

		setError("");
		setMessage("");
		setLoading(true);

		try {
			const res = await fetch("/api/auth/register/request-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: pending.name,
					email: pending.email,
					password: pending.password,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.error || data.details || "Gagal mengirim ulang OTP");
				return;
			}

			const nextPending = {
				...pending,
				expiresAt: data.expiresAt,
			};
			sessionStorage.setItem("pending-register", JSON.stringify(nextPending));
			setPending(nextPending);
			setOtp("");
			setMessage("OTP baru sudah dikirim ke email Anda.");
		} catch (err) {
			console.error("Register resend OTP catch error:", err);
			setError(err instanceof Error ? err.message : "Terjadi kesalahan");
		} finally {
			setLoading(false);
		}
	};

	if (!pending) {
		return (
			<div className="mx-auto max-w-md px-4 py-16 text-center">
				<p>Memuat verifikasi OTP...</p>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-md px-4 py-16">
			<h1 className="mb-2 text-3xl font-bold">Verifikasi OTP</h1>
			<p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
				Masukkan kode OTP yang kami kirim ke <span className="font-medium text-zinc-900 dark:text-zinc-100">{pending.email}</span>.
			</p>
			<div className={`mb-8 rounded-lg px-4 py-3 text-sm ${isExpired ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300" : "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300"}`}>
				{isExpired ? "Waktu OTP habis. Silakan kirim ulang OTP." : `Sisa waktu OTP: ${timerLabel}`}
			</div>

			<form onSubmit={handleVerify} className="space-y-4">
				{error && <div className="rounded bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</div>}
				{message && <div className="rounded bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">{message}</div>}
				<div>
					<label htmlFor="otp" className="mb-1 block text-sm font-medium">
						Kode OTP
					</label>
					<input
						id="otp"
						type="text"
						inputMode="numeric"
						pattern="[0-9]{6}"
						maxLength={6}
						value={otp}
						onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
						required
						className="w-full rounded-lg border border-zinc-300 px-4 py-2 tracking-[0.4em] dark:border-zinc-700 dark:bg-zinc-900"
					/>
				</div>
				<button
					type="submit"
					disabled={loading || isExpired}
					className="w-full rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
				>
					{loading ? "Memproses..." : "Verifikasi & Daftar"}
				</button>
			</form>

			<div className="mt-4 flex gap-3">
				<button
					type="button"
					onClick={() => void handleResend()}
					disabled={loading}
					className="w-full rounded-lg border border-orange-500 px-4 py-2 font-semibold text-orange-500 hover:bg-orange-50 disabled:opacity-50 dark:hover:bg-orange-950/30"
				>
					Kirim Ulang OTP
				</button>
				<Link
					href="/register"
					className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-center font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
				>
					Kembali
				</Link>
			</div>
		</div>
	);
}

export default function RegisterVerifyPage() {
	return (
		<Suspense fallback={<div className="mx-auto max-w-md px-4 py-16 text-center">Memuat verifikasi OTP...</div>}>
			<RegisterVerifyContent />
		</Suspense>
	);
}

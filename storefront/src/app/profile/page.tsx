"use client";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Modal } from "@/components/Modal";
import { Toast } from "@/components/Toast";
import Link from "next/link";
import { BackButton } from "@/components/BackButton";

export default function ProfilePage() {
	const { user, loading, refresh } = useAuth();
	const router = useRouter();
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [saving, setSaving] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});

		// Validasi
		const newErrors: Record<string, string> = {};
		if (!name || name.trim().length === 0) {
			newErrors.name = "Nama harus diisi";
		}
		if (phone && phone.trim().length > 0 && !/^[0-9+\-\s()]+$/.test(phone)) {
			newErrors.phone = "Format nomor telepon tidak valid";
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		setSaving(true);
		try {
			const res = await fetch("/api/auth/profile", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: name.trim(), phone: phone.trim() || undefined }),
			});

			const contentType = res.headers.get("content-type");
			if (!contentType || !contentType.includes("application/json")) {
				const text = await res.text();
				console.error("Non-JSON response:", text.substring(0, 200));
				setToast({ message: "Server mengembalikan response yang tidak valid", type: "error" });
				setTimeout(() => setToast(null), 3000);
				setSaving(false);
				return;
			}

			const data = await res.json();

			if (res.ok) {
				setToast({ message: "Profile berhasil diupdate", type: "success" });
				await refresh();
				setTimeout(() => setToast(null), 3000);
			} else {
				const errorMsg = data.error || data.details || "Gagal mengupdate profile";
				setToast({ message: errorMsg, type: "error" });
				setTimeout(() => setToast(null), 3000);
			}
		} catch (error) {
			console.error("Error updating profile:", error);
			setToast({ message: "Terjadi kesalahan saat mengupdate profile", type: "error" });
			setTimeout(() => setToast(null), 3000);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="mx-auto max-w-4xl px-4 py-16">
			<div className="mb-6">
				<BackButton href="/" label="Kembali ke Beranda" />
			</div>
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
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="mb-1 block text-sm font-medium">Nama</label>
								<input
									type="text"
									value={name}
									onChange={(e) => {
										setName(e.target.value);
										if (errors.name) setErrors({ ...errors, name: "" });
									}}
									required
									className={`w-full rounded-lg border px-4 py-2 dark:bg-zinc-900 ${
										errors.name ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"
									}`}
								/>
								{errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
							</div>
							<div>
								<label className="mb-1 block text-sm font-medium">Email</label>
								<input
									type="email"
									value={user.email}
									disabled
									className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-800"
								/>
								<p className="mt-1 text-xs text-zinc-500">Email tidak dapat diubah</p>
							</div>
							<div>
								<label className="mb-1 block text-sm font-medium">No. Telepon</label>
								<input
									type="tel"
									value={phone}
									onChange={(e) => {
										setPhone(e.target.value);
										if (errors.phone) setErrors({ ...errors, phone: "" });
									}}
									placeholder="08xxxxxxxxxx"
									className={`w-full rounded-lg border px-4 py-2 dark:bg-zinc-900 ${
										errors.phone ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"
									}`}
								/>
								{errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
							</div>
							<button
								type="submit"
								disabled={saving}
								className="rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{saving ? (
									<span className="flex items-center justify-center gap-2">
										<svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										Menyimpan...
									</span>
								) : (
									"Simpan Perubahan"
								)}
							</button>
						</form>
					</div>
				</div>
			</div>

			{/* Toast Notification */}
			{toast && (
				<Toast
					message={toast.message}
					type={toast.type}
					onClose={() => setToast(null)}
				/>
			)}
		</div>
	);
}

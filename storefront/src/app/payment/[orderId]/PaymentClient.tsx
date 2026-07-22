"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { formatIDR } from "@/lib/products";
import Link from "next/link";
import { Modal } from "@/components/Modal";
import { Toast } from "@/components/Toast";
import { BackButton } from "@/components/BackButton";
import { getLocalOrder, updateLocalOrder } from "@/lib/localOrders";

type Order = {
	id: string;
	userId: string;
	items: Array<{
		productId: string;
		title: string;
		image: string;
		price: number;
		quantity: number;
	}>;
	total: number;
	status: string;
	shippingAddress: {
		name: string;
		phone: string;
		address: string;
		city: string;
		postalCode: string;
	};
	paymentMethod: string;
	createdAt: string;
	updatedAt: string;
};

const bankAccounts = [
	{
		bank: "Bank BCA",
		accountNumber: "1234567890",
		accountName: "BIMA STORE",
		logo: "🏦",
	},
	{
		bank: "Bank Mandiri",
		accountNumber: "0987654321",
		accountName: "BIMA STORE",
		logo: "🏦",
	},
	{
		bank: "Bank BRI",
		accountNumber: "1122334455",
		accountName: "BIMA STORE",
		logo: "🏦",
	},
];

export default function PaymentClient() {
	const params = useParams();
	const router = useRouter();
	const [order, setOrder] = useState<Order | null>(null);
	const [loading, setLoading] = useState(true);
	const [uploading, setUploading] = useState(false);
	const [paymentProof, setPaymentProof] = useState<File | null>(null);
	const [note, setNote] = useState("");
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
	const [showConfirmModal, setShowConfirmModal] = useState(false);

	useEffect(() => {
		if (params.orderId) setOrder(getLocalOrder(String(params.orderId)) || null);
		setLoading(false);
	}, [params.orderId]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			// Validasi ukuran file (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				setErrors({ ...errors, paymentProof: "Ukuran file maksimal 5MB" });
				return;
			}
			// Validasi tipe file
			const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
			if (!allowedTypes.includes(file.type)) {
				setErrors({ ...errors, paymentProof: "Format file harus JPG, PNG, WEBP, atau PDF" });
				return;
			}
			setPaymentProof(file);
			setErrors({ ...errors, paymentProof: "" });
		}
	};

	const handleConfirmPayment = async () => {
		if (!order) return;

		// Validasi
		const newErrors: Record<string, string> = {};
		if (!paymentProof) {
			newErrors.paymentProof = "Bukti pembayaran harus diupload";
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			setShowConfirmModal(false);
			return;
		}

		setUploading(true);
		try {
			updateLocalOrder(order.id, { status: "paid", note: note || undefined });
			setToast({ message: "Pembayaran berhasil dikonfirmasi! Pesanan Anda sedang diproses.", type: "success" });
			setTimeout(() => router.push("/orders"), 1200);
		} finally {
			setUploading(false);
			setShowConfirmModal(false);
		}
	};

	if (loading) {
		return (
			<div className="mx-auto max-w-4xl px-4 py-16 text-center">
				<p>Memuat...</p>
			</div>
		);
	}

	if (!order) {
		return (
			<div className="mx-auto max-w-4xl px-4 py-16 text-center">
				<p className="mb-4">Pesanan tidak ditemukan</p>
				<Link href="/orders" className="text-orange-500 hover:underline">
					Kembali ke Pesanan Saya
				</Link>
			</div>
		);
	}

	if (order.status !== "pending") {
		return (
			<div className="mx-auto max-w-4xl px-4 py-16">
				<div className="rounded-lg border border-zinc-200 p-8 text-center dark:border-zinc-800">
					<p className="mb-4 text-lg font-semibold">Pesanan sudah dibayar</p>
					<p className="mb-6 text-zinc-600 dark:text-zinc-400">
						Status: {order.status === "paid" ? "Sudah Dibayar" : order.status}
					</p>
					<Link href="/orders" className="inline-block rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600">
						Lihat Pesanan Saya
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
			<div className="mb-6">
				<BackButton href="/orders" label="Kembali ke Pesanan Saya" />
			</div>
			<h1 className="mb-6 text-2xl font-bold">Pembayaran</h1>

			<div className="mb-6 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
				<h2 className="mb-4 text-lg font-semibold">Detail Pesanan</h2>
				<div className="space-y-2 text-sm">
					<p>
						<span className="font-medium">Order ID:</span> {order.id}
					</p>
					<p>
						<span className="font-medium">Total Pembayaran:</span>{" "}
						<span className="text-lg font-bold text-orange-500">{formatIDR(order.total)}</span>
					</p>
					<p>
						<span className="font-medium">Metode Pembayaran:</span> Transfer Bank
					</p>
				</div>
			</div>

			<div className="mb-6 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
				<h2 className="mb-4 text-lg font-semibold">Rekening Bank</h2>
				<p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
					Silakan transfer ke salah satu rekening berikut:
				</p>
				<div className="space-y-4">
					{bankAccounts.map((account, idx) => (
						<div key={idx} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
							<div className="flex items-center gap-3 mb-2">
								<span className="text-2xl">{account.logo}</span>
								<div>
									<p className="font-semibold">{account.bank}</p>
									<p className="text-sm text-zinc-600 dark:text-zinc-400">{account.accountName}</p>
								</div>
							</div>
							<div className="mt-3 flex items-center justify-between rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
								<span className="text-sm font-mono">{account.accountNumber}</span>
								<button
									onClick={async () => {
										try {
											await navigator.clipboard.writeText(account.accountNumber);
											setToast({ message: "Nomor rekening disalin!", type: "success" });
											setTimeout(() => setToast(null), 2000);
										} catch (err) {
											setToast({ message: "Gagal menyalin nomor rekening", type: "error" });
											setTimeout(() => setToast(null), 2000);
										}
									}}
									className="rounded px-2 py-1 text-xs font-medium text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
								>
									Salin
								</button>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="mb-6 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
				<h2 className="mb-4 text-lg font-semibold">Cara Pembayaran</h2>
				<ol className="list-decimal space-y-2 pl-5 text-sm">
					<li>Transfer sesuai dengan total pembayaran: <strong>{formatIDR(order.total)}</strong></li>
					<li>Transfer ke salah satu rekening di atas</li>
					<li>Pastikan nominal transfer sesuai (tidak kurang, tidak lebih)</li>
					<li>Simpan bukti transfer Anda</li>
					<li>Klik tombol &quot;Konfirmasi Pembayaran&quot; setelah transfer</li>
				</ol>
			</div>

			<div className="mb-6 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
				<h2 className="mb-4 text-lg font-semibold">Konfirmasi Pembayaran</h2>
				<div className="space-y-4">
					<div>
						<label className="mb-2 block text-sm font-medium">
							Upload Bukti Transfer <span className="text-red-500">*</span>
						</label>
						<input
							type="file"
							accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
							onChange={handleFileChange}
							className={`w-full rounded-lg border px-4 py-2 text-sm dark:bg-zinc-900 ${
								errors.paymentProof ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"
							}`}
						/>
						{errors.paymentProof && (
							<p className="mt-1 text-xs text-red-500">{errors.paymentProof}</p>
						)}
						{paymentProof && !errors.paymentProof && (
							<p className="mt-2 text-sm text-green-600 dark:text-green-400">
								✓ File dipilih: {paymentProof.name} ({(paymentProof.size / 1024).toFixed(2)} KB)
							</p>
						)}
						<p className="mt-1 text-xs text-zinc-500">
							Format: JPG, PNG, WEBP, atau PDF (maks. 5MB)
						</p>
					</div>
					<div>
						<label className="mb-2 block text-sm font-medium">Catatan (Opsional)</label>
						<textarea
							value={note}
							onChange={(e) => setNote(e.target.value)}
							rows={3}
							placeholder="Contoh: Transfer dari BCA, jam 14:30"
							className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
						/>
					</div>
					<button
						onClick={() => setShowConfirmModal(true)}
						disabled={uploading}
						className="w-full rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{uploading ? (
							<span className="flex items-center justify-center gap-2">
								<svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Memproses...
							</span>
						) : (
							"Konfirmasi Pembayaran"
						)}
					</button>
					<p className="text-xs text-zinc-600 dark:text-zinc-400">
						* Setelah konfirmasi, pesanan Anda akan diproses. Admin akan memverifikasi pembayaran Anda.
					</p>
				</div>
			</div>

			<div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
				<p className="text-sm text-yellow-800 dark:text-yellow-400">
					<strong>Penting:</strong> Jangan transfer ke rekening selain yang tertera di atas. Pastikan nominal
					transfer sesuai dengan total pesanan.
				</p>
			</div>

			{/* Confirmation Modal */}
			<Modal
				isOpen={showConfirmModal}
				onClose={() => setShowConfirmModal(false)}
				title="Konfirmasi Pembayaran"
				size="sm"
			>
				<div className="space-y-4">
					<p className="text-sm text-zinc-600 dark:text-zinc-400">
						Apakah Anda sudah melakukan transfer sebesar <strong className="text-orange-500">{formatIDR(order.total)}</strong>?
					</p>
					{!paymentProof && (
						<div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
							<p className="text-xs text-yellow-800 dark:text-yellow-400">
								⚠️ Anda belum mengupload bukti pembayaran. Pastikan Anda sudah melakukan transfer sebelum mengkonfirmasi.
							</p>
						</div>
					)}
					<div className="flex justify-end gap-3">
						<button
							onClick={() => setShowConfirmModal(false)}
							className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
						>
							Batal
						</button>
						<button
							onClick={handleConfirmPayment}
							disabled={uploading}
							className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
						>
							{uploading ? "Memproses..." : "Ya, Konfirmasi"}
						</button>
					</div>
				</div>
			</Modal>

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


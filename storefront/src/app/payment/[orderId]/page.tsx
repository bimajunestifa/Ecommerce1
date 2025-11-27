"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { formatIDR } from "@/lib/products";
import Link from "next/link";

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

export default function PaymentPage() {
	const params = useParams();
	const router = useRouter();
	const { user, loading: authLoading } = useAuth();
	const [order, setOrder] = useState<Order | null>(null);
	const [loading, setLoading] = useState(true);
	const [uploading, setUploading] = useState(false);
	const [paymentProof, setPaymentProof] = useState<File | null>(null);
	const [note, setNote] = useState("");

	useEffect(() => {
		if (!authLoading && !user) {
			router.push("/login");
			return;
		}

		if (user && params.orderId) {
			fetchOrder();
		}
	}, [user, authLoading, params.orderId, router]);

	const fetchOrder = async () => {
		try {
			const res = await fetch(`/api/orders/${params.orderId}`);
			if (res.ok) {
				const data = await res.json();
				setOrder(data.order);
			}
		} catch (error) {
			console.error("Error fetching order:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setPaymentProof(e.target.files[0]);
		}
	};

	const handleConfirmPayment = async () => {
		if (!order) return;

		setUploading(true);
		try {
			// Update order status to paid
			const res = await fetch(`/api/orders/${order.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: "paid" }),
			});

			if (res.ok) {
				alert("Pembayaran berhasil dikonfirmasi! Pesanan Anda sedang diproses.");
				router.push("/orders");
			} else {
				alert("Gagal mengkonfirmasi pembayaran");
			}
		} catch (error) {
			console.error("Error confirming payment:", error);
			alert("Terjadi kesalahan");
		} finally {
			setUploading(false);
		}
	};

	if (authLoading || loading) {
		return (
			<div className="mx-auto max-w-4xl px-4 py-16 text-center">
				<p>Memuat...</p>
			</div>
		);
	}

	if (!user) {
		return null;
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
									onClick={() => {
										navigator.clipboard.writeText(account.accountNumber);
										alert("Nomor rekening disalin!");
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
					<li>Klik tombol "Konfirmasi Pembayaran" setelah transfer</li>
				</ol>
			</div>

			<div className="mb-6 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
				<h2 className="mb-4 text-lg font-semibold">Konfirmasi Pembayaran</h2>
				<div className="space-y-4">
					<div>
						<label className="mb-2 block text-sm font-medium">
							Upload Bukti Transfer (Opsional)
						</label>
						<input
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
						/>
						{paymentProof && (
							<p className="mt-2 text-sm text-green-600 dark:text-green-400">
								✓ File dipilih: {paymentProof.name}
							</p>
						)}
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
						onClick={handleConfirmPayment}
						disabled={uploading}
						className="w-full rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
					>
						{uploading ? "Memproses..." : "Konfirmasi Pembayaran"}
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
		</div>
	);
}

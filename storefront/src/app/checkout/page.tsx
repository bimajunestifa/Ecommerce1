"use client";
import { useCart } from "@/components/cart/CartContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { useState, useEffect } from "react";
import { formatIDR } from "@/lib/products";
import { Modal } from "@/components/Modal";
import { BackButton } from "@/components/BackButton";

export default function CheckoutPage() {
	const { items, total, clear } = useCart();
	const { user } = useAuth();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [shippingAddress, setShippingAddress] = useState({
		name: "",
		phone: "",
		address: "",
		city: "",
		postalCode: "",
	});
	const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
	const [errorModal, setErrorModal] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: "" });
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (!user && !loading) {
			router.push("/login");
		}
	}, [user, loading, router]);

	async function placeOrder() {
		if (!user) {
			router.push("/login");
			return;
		}

		// Validasi form
		const newErrors: Record<string, string> = {};
		if (!shippingAddress.name) newErrors.name = "Nama penerima harus diisi";
		if (!shippingAddress.phone) newErrors.phone = "Nomor telepon harus diisi";
		if (!shippingAddress.address) newErrors.address = "Alamat harus diisi";
		if (!shippingAddress.city) newErrors.city = "Kota harus diisi";
		if (!shippingAddress.postalCode) newErrors.postalCode = "Kode pos harus diisi";

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			setErrorModal({ isOpen: true, message: "Mohon lengkapi semua field alamat pengiriman" });
			return;
		}

		if (items.length === 0) {
			setErrorModal({ isOpen: true, message: "Keranjang Anda kosong" });
			return;
		}

		setErrors({});
		setLoading(true);
		
		try {
			const res = await fetch("/api/orders", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					items: items.map((item) => ({
						productId: item.id,
						title: item.title,
						image: item.image,
						price: item.price,
						quantity: item.qty,
					})),
					total,
					shippingAddress: {
						...shippingAddress,
						id: `addr-${Date.now()}`,
						isDefault: false,
					},
					paymentMethod,
				}),
			});

			const data = await res.json();

			if (res.ok) {
				clear();
				// Redirect ke halaman pembayaran jika bank transfer
				if (paymentMethod === "bank_transfer") {
					router.push(`/payment/${data.order.id}`);
				} else {
					router.push("/checkout/success");
				}
			} else {
				const errorMessage = data.error || data.details || "Gagal membuat pesanan. Silakan coba lagi.";
				setErrorModal({ isOpen: true, message: errorMessage });
			}
		} catch (error) {
			console.error("Error placing order:", error);
			setErrorModal({ 
				isOpen: true, 
				message: "Terjadi kesalahan saat memproses pesanan. Silakan coba lagi atau hubungi customer service." 
			});
		} finally {
			setLoading(false);
		}
	}

	if (!user) {
		return null;
	}

	return (
		<div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
			<div className="mb-6">
				<BackButton href="/cart" label="Kembali ke Keranjang" />
			</div>
			<h1 className="mb-6 text-2xl font-bold">Checkout</h1>
			<div className="grid gap-8 md:grid-cols-2">
				<div className="space-y-6">
					<div className="rounded-lg border p-6 dark:border-zinc-800">
						<h2 className="mb-4 text-lg font-semibold">Alamat Pengiriman</h2>
						<div className="space-y-4">
							<div>
								<label className="mb-1 block text-sm font-medium">Nama Penerima</label>
								<input
									type="text"
									value={shippingAddress.name}
									onChange={(e) => {
										setShippingAddress({ ...shippingAddress, name: e.target.value });
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
								<label className="mb-1 block text-sm font-medium">No. Telepon</label>
								<input
									type="tel"
									value={shippingAddress.phone}
									onChange={(e) => {
										setShippingAddress({ ...shippingAddress, phone: e.target.value });
										if (errors.phone) setErrors({ ...errors, phone: "" });
									}}
									required
									className={`w-full rounded-lg border px-4 py-2 dark:bg-zinc-900 ${
										errors.phone ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"
									}`}
								/>
								{errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
							</div>
							<div>
								<label className="mb-1 block text-sm font-medium">Alamat</label>
								<textarea
									value={shippingAddress.address}
									onChange={(e) => {
										setShippingAddress({ ...shippingAddress, address: e.target.value });
										if (errors.address) setErrors({ ...errors, address: "" });
									}}
									required
									rows={3}
									className={`w-full rounded-lg border px-4 py-2 dark:bg-zinc-900 ${
										errors.address ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"
									}`}
								/>
								{errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="mb-1 block text-sm font-medium">Kota</label>
									<input
										type="text"
										value={shippingAddress.city}
										onChange={(e) => {
											setShippingAddress({ ...shippingAddress, city: e.target.value });
											if (errors.city) setErrors({ ...errors, city: "" });
										}}
										required
										className={`w-full rounded-lg border px-4 py-2 dark:bg-zinc-900 ${
											errors.city ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"
										}`}
									/>
									{errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
								</div>
								<div>
									<label className="mb-1 block text-sm font-medium">Kode Pos</label>
									<input
										type="text"
										value={shippingAddress.postalCode}
										onChange={(e) => {
											setShippingAddress({ ...shippingAddress, postalCode: e.target.value });
											if (errors.postalCode) setErrors({ ...errors, postalCode: "" });
										}}
										required
										className={`w-full rounded-lg border px-4 py-2 dark:bg-zinc-900 ${
											errors.postalCode ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"
										}`}
									/>
									{errors.postalCode && <p className="mt-1 text-xs text-red-500">{errors.postalCode}</p>}
								</div>
							</div>
						</div>
					</div>

					<div className="rounded-lg border p-6 dark:border-zinc-800">
						<h2 className="mb-4 text-lg font-semibold">Metode Pembayaran</h2>
						<div className="space-y-2">
							<label className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900">
								<input
									type="radio"
									name="payment"
									value="bank_transfer"
									checked={paymentMethod === "bank_transfer"}
									onChange={(e) => setPaymentMethod(e.target.value)}
								/>
								<span>Transfer Bank</span>
							</label>
							<label className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900">
								<input
									type="radio"
									name="payment"
									value="e_wallet"
									checked={paymentMethod === "e_wallet"}
									onChange={(e) => setPaymentMethod(e.target.value)}
								/>
								<span>E-Wallet</span>
							</label>
							<label className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900">
								<input
									type="radio"
									name="payment"
									value="cod"
									checked={paymentMethod === "cod"}
									onChange={(e) => setPaymentMethod(e.target.value)}
								/>
								<span>Cash on Delivery (COD)</span>
							</label>
						</div>
					</div>
				</div>

				<div>
					<div className="rounded-lg border p-6 dark:border-zinc-800">
						<h2 className="mb-4 text-lg font-semibold">Ringkasan Pesanan</h2>
						<ul className="divide-y dark:divide-zinc-800">
							{items.map((i) => (
								<li key={i.id} className="flex items-center gap-4 py-3">
									<div className="h-16 w-16 flex-shrink-0 rounded-lg border bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
										{i.image ? (
											<img 
												src={i.image} 
												alt={i.title} 
												className="h-full w-full object-cover" 
											/>
										) : (
											<div className="h-full w-full" />
										)}
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium line-clamp-2">{i.title}</p>
										<p className="text-sm text-zinc-600 dark:text-zinc-400">
											{formatIDR(i.price)} × {i.qty}
										</p>
									</div>
									<p className="text-sm font-semibold whitespace-nowrap">{formatIDR(i.price * i.qty)}</p>
								</li>
							))}
						</ul>
						<div className="mt-4 space-y-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
							<div className="flex items-center justify-between text-sm">
								<span>Subtotal</span>
								<span>{formatIDR(total)}</span>
							</div>
							<div className="flex items-center justify-between text-sm">
								<span>Ongkir</span>
								<span>Gratis</span>
							</div>
							<div className="flex items-center justify-between text-lg font-semibold">
								<span>Total</span>
								<span>{formatIDR(total)}</span>
							</div>
						</div>
						<button
							onClick={placeOrder}
							disabled={items.length === 0 || loading}
							className="mt-6 w-full rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? (
								<span className="flex items-center justify-center gap-2">
									<svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Memproses...
								</span>
							) : (
								"Buat Pesanan"
							)}
						</button>
						{items.length === 0 && (
							<p className="mt-2 text-center text-xs text-red-500">Keranjang Anda kosong</p>
						)}
					</div>
				</div>
			</div>

			{/* Error Modal */}
			<Modal
				isOpen={errorModal.isOpen}
				onClose={() => setErrorModal({ isOpen: false, message: "" })}
				title="Error"
				size="sm"
			>
				<div className="space-y-4">
					<div className="flex items-start gap-3">
						<div className="flex-shrink-0 rounded-full bg-red-100 p-2 dark:bg-red-900/20">
							<svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<p className="flex-1 text-sm text-zinc-600 dark:text-zinc-400">{errorModal.message}</p>
					</div>
					<div className="flex justify-end">
						<button
							onClick={() => setErrorModal({ isOpen: false, message: "" })}
							className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
						>
							Mengerti
						</button>
					</div>
				</div>
			</Modal>
		</div>
	);
}



"use client";
import { useCart } from "@/components/cart/CartContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { useState, useEffect } from "react";
import { formatIDR } from "@/lib/products";

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

		if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
			alert("Mohon lengkapi alamat pengiriman");
			return;
		}

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

			if (res.ok) {
				const orderData = await res.json();
				clear();
				// Redirect ke halaman pembayaran jika bank transfer
				if (paymentMethod === "bank_transfer") {
					router.push(`/payment/${orderData.order.id}`);
				} else {
					router.push("/checkout/success");
				}
			} else {
				alert("Gagal membuat pesanan");
			}
		} catch (error) {
			console.error("Error placing order:", error);
			alert("Terjadi kesalahan");
		} finally {
			setLoading(false);
		}
	}

	if (!user) {
		return null;
	}

	return (
		<div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
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
									onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
									required
									className="w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
								/>
							</div>
							<div>
								<label className="mb-1 block text-sm font-medium">No. Telepon</label>
								<input
									type="tel"
									value={shippingAddress.phone}
									onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
									required
									className="w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
								/>
							</div>
							<div>
								<label className="mb-1 block text-sm font-medium">Alamat</label>
								<textarea
									value={shippingAddress.address}
									onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
									required
									rows={3}
									className="w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="mb-1 block text-sm font-medium">Kota</label>
									<input
										type="text"
										value={shippingAddress.city}
										onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
										required
										className="w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
									/>
								</div>
								<div>
									<label className="mb-1 block text-sm font-medium">Kode Pos</label>
									<input
										type="text"
										value={shippingAddress.postalCode}
										onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
										required
										className="w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
									/>
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
							className="mt-6 w-full rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
						>
							{loading ? "Memproses..." : "Buat Pesanan"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}



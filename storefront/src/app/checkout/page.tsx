"use client";

import { BackButton } from "@/components/BackButton";
import { useCart } from "@/components/cart/CartContext";
import { createLocalOrder } from "@/lib/localOrders";
import { getCmsSettings } from "@/lib/localCms";
import { formatIDR } from "@/lib/products";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const couriers = [
	{ id: "regular", name: "Reguler", detail: "J&T / JNE / SiCepat · 2-4 hari", fee: 15000 },
	{ id: "hemat", name: "Hemat", detail: "Pengiriman ekonomis · 4-7 hari", fee: 8000 },
	{ id: "instant", name: "Instant", detail: "GoSend / GrabExpress · hari ini", fee: 35000 },
];

const payments = [
	{ id: "bank_transfer", name: "Transfer Bank", detail: "BCA, Mandiri, BRI, BNI" },
	{ id: "e_wallet", name: "E-Wallet", detail: "GoPay, OVO, DANA, ShopeePay" },
	{ id: "cod", name: "Bayar di Tempat (COD)", detail: "Bayar tunai saat paket diterima" },
];

type AddressForm = { name: string; phone: string; address: string; city: string; postalCode: string };

export default function CheckoutPage() {
	const { items, total: subtotal, clear } = useCart();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [courier, setCourier] = useState(couriers[0]);
	const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
	const [voucher, setVoucher] = useState("");
	const [voucherApplied, setVoucherApplied] = useState(false);
	const [voucherMessage, setVoucherMessage] = useState("");
	const [note, setNote] = useState("");
	const [cmsSettings] = useState(() => getCmsSettings());
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [address, setAddress] = useState<AddressForm>(() => {
		const empty: AddressForm = { name: "", phone: "", address: "", city: "", postalCode: "" };
		if (typeof window === "undefined") return empty;
		try {
			const saved = localStorage.getItem("bimastore:checkout-address");
			return saved ? { ...empty, ...JSON.parse(saved) } : empty;
		} catch { return empty; }
	});

	const discount = voucherApplied ? Math.min(Math.round(subtotal * (cmsSettings.voucherPercent / 100)), cmsSettings.maxDiscount) : 0;
	const serviceFee = subtotal > 0 ? 1000 : 0;
	const grandTotal = useMemo(
		() => Math.max(0, subtotal + courier.fee + serviceFee - discount),
		[subtotal, courier.fee, serviceFee, discount],
	);

	function updateAddress(field: keyof typeof address, value: string) {
		setAddress((current) => ({ ...current, [field]: value }));
		setErrors((current) => ({ ...current, [field]: "" }));
	}

	function applyVoucher() {
		if (voucher.trim().toUpperCase() === cmsSettings.voucherCode.toUpperCase()) {
			setVoucherApplied(true);
			setVoucherMessage(`Voucher ${cmsSettings.voucherCode} berhasil dipakai`);
		} else {
			setVoucherApplied(false);
			setVoucherMessage(`Kode voucher tidak valid. Coba ${cmsSettings.voucherCode}`);
		}
	}

	function placeOrder() {
		const nextErrors: Record<string, string> = {};
		if (!address.name.trim()) nextErrors.name = "Nama penerima wajib diisi";
		if (!/^08\d{8,11}$/.test(address.phone.replace(/\s/g, ""))) nextErrors.phone = "Gunakan nomor Indonesia yang valid";
		if (address.address.trim().length < 10) nextErrors.address = "Tulis alamat lebih lengkap";
		if (!address.city.trim()) nextErrors.city = "Kota/kabupaten wajib diisi";
		if (!/^\d{5}$/.test(address.postalCode)) nextErrors.postalCode = "Kode pos harus 5 angka";
		if (items.length === 0) nextErrors.cart = "Keranjang masih kosong";
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) {
			window.scrollTo({ top: 0, behavior: "smooth" });
			return;
		}

		setLoading(true);
		localStorage.setItem("bimastore:checkout-address", JSON.stringify(address));
		const now = new Date();
		const order = createLocalOrder({
			userId: "guest-demo",
			items: items.map((item) => ({ productId: item.id, title: item.title, image: item.image, price: item.price, quantity: item.qty })),
			subtotal,
			shippingFee: courier.fee,
			serviceFee,
			discount,
			total: grandTotal,
			status: paymentMethod === "cod" ? "processing" : "pending",
			shippingAddress: { ...address, id: `addr-${now.getTime()}`, isDefault: true },
			paymentMethod,
			courier: courier.name,
			voucherCode: voucherApplied ? cmsSettings.voucherCode : undefined,
			note: note || undefined,
		});
		clear();
		setTimeout(() => router.push(paymentMethod === "bank_transfer" ? `/payment/${order.id}` : `/checkout/success?order=${order.id}`), 400);
	}

	const fieldClass = (key: string) => `w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:bg-zinc-950 dark:focus:ring-orange-950 ${errors[key] ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"}`;

	return (
		<div className="min-h-screen bg-zinc-50 py-8 dark:bg-zinc-950">
			<div className="mx-auto max-w-6xl px-4 sm:px-6">
				<BackButton href="/cart" label="Kembali ke Keranjang" />
				<div className="my-6 flex items-center justify-between">
					<div><h1 className="text-2xl font-bold">Checkout</h1><p className="mt-1 text-sm text-zinc-500">Lengkapi pesanan dengan aman</p></div>
					<span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">Mode demo · tanpa database</span>
				</div>

				<div className="grid items-start gap-6 lg:grid-cols-[1fr_390px]">
					<div className="space-y-5">
						<section className="rounded-2xl border bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-black sm:p-6">
							<div className="mb-5 flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-orange-100 font-bold text-orange-600">1</span><h2 className="font-semibold">Alamat Pengiriman</h2></div>
							<div className="grid gap-4 sm:grid-cols-2">
								<label className="text-sm font-medium">Nama Penerima<input value={address.name} onChange={(e) => updateAddress("name", e.target.value)} placeholder="Nama lengkap" className={`mt-2 ${fieldClass("name")}`} />{errors.name && <span className="mt-1 block text-xs text-red-500">{errors.name}</span>}</label>
								<label className="text-sm font-medium">Nomor Telepon<input value={address.phone} onChange={(e) => updateAddress("phone", e.target.value.replace(/[^0-9]/g, ""))} placeholder="08xxxxxxxxxx" className={`mt-2 ${fieldClass("phone")}`} />{errors.phone && <span className="mt-1 block text-xs text-red-500">{errors.phone}</span>}</label>
								<label className="text-sm font-medium sm:col-span-2">Alamat Lengkap<textarea value={address.address} onChange={(e) => updateAddress("address", e.target.value)} placeholder="Nama jalan, nomor rumah, RT/RW, kecamatan" rows={3} className={`mt-2 resize-none ${fieldClass("address")}`} />{errors.address && <span className="mt-1 block text-xs text-red-500">{errors.address}</span>}</label>
								<label className="text-sm font-medium">Kota / Kabupaten<input value={address.city} onChange={(e) => updateAddress("city", e.target.value)} placeholder="Contoh: Surabaya" className={`mt-2 ${fieldClass("city")}`} />{errors.city && <span className="mt-1 block text-xs text-red-500">{errors.city}</span>}</label>
								<label className="text-sm font-medium">Kode Pos<input value={address.postalCode} maxLength={5} onChange={(e) => updateAddress("postalCode", e.target.value.replace(/[^0-9]/g, ""))} placeholder="12345" className={`mt-2 ${fieldClass("postalCode")}`} />{errors.postalCode && <span className="mt-1 block text-xs text-red-500">{errors.postalCode}</span>}</label>
							</div>
						</section>

						<section className="rounded-2xl border bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-black sm:p-6">
							<div className="mb-5 flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-orange-100 font-bold text-orange-600">2</span><h2 className="font-semibold">Pilihan Pengiriman</h2></div>
							<div className="grid gap-3 sm:grid-cols-3">{couriers.map((option) => <button type="button" key={option.id} onClick={() => setCourier(option)} className={`rounded-xl border p-4 text-left transition ${courier.id === option.id ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500 dark:bg-orange-950/20" : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800"}`}><span className="block text-sm font-semibold">{option.name}</span><span className="mt-1 block text-xs text-zinc-500">{option.detail}</span><span className="mt-3 block text-sm font-semibold text-orange-600">{formatIDR(option.fee)}</span></button>)}</div>
						</section>

						<section className="rounded-2xl border bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-black sm:p-6">
							<div className="mb-5 flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-orange-100 font-bold text-orange-600">3</span><h2 className="font-semibold">Metode Pembayaran</h2></div>
							<div className="space-y-3">{payments.filter((option) => option.id !== "cod" || cmsSettings.codEnabled).filter((option) => option.id !== "e_wallet" || cmsSettings.eWalletEnabled).map((option) => <label key={option.id} className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 ${paymentMethod === option.id ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20" : "border-zinc-200 dark:border-zinc-800"}`}><input type="radio" name="payment" value={option.id} checked={paymentMethod === option.id} onChange={() => setPaymentMethod(option.id)} className="accent-orange-500" /><span><span className="block text-sm font-semibold">{option.name}</span><span className="text-xs text-zinc-500">{option.detail}</span></span></label>)}</div>
						</section>
					</div>

					<aside className="rounded-2xl border bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-black lg:sticky lg:top-24">
						<h2 className="text-lg font-semibold">Ringkasan Pesanan</h2>
						<div className="my-4 max-h-64 space-y-4 overflow-auto pr-1">{items.map((item) => <div key={item.id} className="flex gap-3"><div className="h-16 w-16 shrink-0 rounded-lg bg-zinc-100 p-1"><img src={item.image} alt={item.title} className="h-full w-full object-contain" /></div><div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm font-medium">{item.title}</p><p className="mt-1 text-xs text-zinc-500">{item.qty} barang</p></div><span className="text-sm font-semibold">{formatIDR(item.price * item.qty)}</span></div>)}</div>
						<div className="border-y border-zinc-200 py-4 dark:border-zinc-800"><div className="flex gap-2"><input value={voucher} disabled={voucherApplied} onChange={(e) => setVoucher(e.target.value)} placeholder="Kode voucher" className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm uppercase dark:border-zinc-700 dark:bg-zinc-950" /><button onClick={applyVoucher} className="rounded-lg border border-orange-500 px-4 text-sm font-semibold text-orange-600">Pakai</button></div>{voucherMessage && <p className={`mt-2 text-xs ${voucherApplied ? "text-green-600" : "text-red-500"}`}>{voucherMessage}</p>}</div>
						<label className="mt-4 block text-sm font-medium">Catatan untuk Penjual<textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Warna, waktu kirim, atau pesan lain" className="mt-2 w-full resize-none rounded-lg border px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" /></label>
						<div className="mt-5 space-y-2 text-sm"><div className="flex justify-between"><span className="text-zinc-500">Subtotal</span><span>{formatIDR(subtotal)}</span></div><div className="flex justify-between"><span className="text-zinc-500">Ongkos kirim</span><span>{formatIDR(courier.fee)}</span></div><div className="flex justify-between"><span className="text-zinc-500">Biaya layanan</span><span>{formatIDR(serviceFee)}</span></div>{discount > 0 && <div className="flex justify-between text-green-600"><span>Diskon voucher</span><span>-{formatIDR(discount)}</span></div>}<div className="mt-3 flex items-end justify-between border-t pt-4 dark:border-zinc-800"><span className="font-semibold">Total Pembayaran</span><span className="text-xl font-bold text-orange-600">{formatIDR(grandTotal)}</span></div></div>
						{errors.cart && <p className="mt-3 text-center text-sm text-red-500">{errors.cart}</p>}
						<button onClick={placeOrder} disabled={loading || items.length === 0} className="mt-5 w-full rounded-xl bg-orange-500 px-5 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Memproses Pesanan..." : "Buat Pesanan"}</button>
						<p className="mt-3 text-center text-xs text-zinc-500">Dengan melanjutkan, Anda menyetujui syarat dan kebijakan BimaStore.</p>
					</aside>
				</div>
			</div>
		</div>
	);
}

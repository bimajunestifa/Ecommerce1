"use client";

import { AdminSidebar } from "@/components/AdminSidebar";
import { defaultCmsSettings, getCmsProducts, getCmsSettings, saveCmsSettings, type CmsSettings } from "@/lib/localCms";
import { useState } from "react";

export default function CmsSettingsPage() {
	const [settings, setSettings] = useState<CmsSettings>(() => getCmsSettings());
	const [message, setMessage] = useState("");
	const update = <K extends keyof CmsSettings>(key: K, value: CmsSettings[K]) => setSettings((current) => ({ ...current, [key]: value }));

	function save() {
		saveCmsSettings(settings);
		setMessage("Semua pengaturan CMS berhasil disimpan.");
		setTimeout(() => setMessage(""), 2500);
	}

	function exportData() {
		const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), settings, products: getCmsProducts() }, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `bimastore-cms-${new Date().toISOString().slice(0, 10)}.json`;
		link.click();
		URL.revokeObjectURL(url);
	}

	const inputClass = "mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-950";
	return (
		<div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
			<AdminSidebar />
			<main className="ml-64 px-6 py-10">
				<div className="mx-auto max-w-5xl">
					<div className="mb-8 flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-3xl font-bold">CMS BimaStore</h1><p className="mt-1 text-sm text-zinc-500">Kelola identitas toko, halaman utama, promo, pembayaran, dan operasional.</p></div><div className="flex gap-2"><button onClick={exportData} className="rounded-xl border px-4 py-2 text-sm font-semibold dark:border-zinc-700">Ekspor Data</button><button onClick={save} className="rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white">Simpan Perubahan</button></div></div>
					{message && <div className="mb-5 rounded-xl bg-green-100 px-4 py-3 text-sm font-medium text-green-700">{message}</div>}
					<div className="grid gap-6 lg:grid-cols-2">
						<section className="rounded-2xl border bg-white p-6 dark:border-zinc-800 dark:bg-black"><h2 className="text-lg font-bold">Identitas Toko</h2><p className="mb-5 mt-1 text-sm text-zinc-500">Informasi merek yang tampil kepada pelanggan.</p><label className="text-sm font-medium">Nama Toko<input value={settings.storeName} onChange={(e) => update("storeName", e.target.value)} className={inputClass} /></label><label className="mt-4 block text-sm font-medium">Teks Pengumuman<input value={settings.announcement} onChange={(e) => update("announcement", e.target.value)} className={inputClass} /></label></section>
						<section className="rounded-2xl border bg-white p-6 dark:border-zinc-800 dark:bg-black"><h2 className="text-lg font-bold">Hero Halaman Utama</h2><p className="mb-5 mt-1 text-sm text-zinc-500">Konten promosi utama di beranda.</p><label className="text-sm font-medium">Label Kecil<input value={settings.heroEyebrow} onChange={(e) => update("heroEyebrow", e.target.value)} className={inputClass} /></label><label className="mt-4 block text-sm font-medium">Judul Utama<input value={settings.heroTitle} onChange={(e) => update("heroTitle", e.target.value)} className={inputClass} /></label><label className="mt-4 block text-sm font-medium">Deskripsi<textarea value={settings.heroDescription} onChange={(e) => update("heroDescription", e.target.value)} rows={3} className={inputClass} /></label><label className="mt-4 block text-sm font-medium">Teks Tombol<input value={settings.heroButton} onChange={(e) => update("heroButton", e.target.value)} className={inputClass} /></label></section>
						<section className="rounded-2xl border bg-white p-6 dark:border-zinc-800 dark:bg-black"><h2 className="text-lg font-bold">Promo & Voucher</h2><p className="mb-5 mt-1 text-sm text-zinc-500">Atur voucher utama yang digunakan di checkout.</p><label className="text-sm font-medium">Kode Voucher<input value={settings.voucherCode} onChange={(e) => update("voucherCode", e.target.value.toUpperCase())} className={inputClass} /></label><div className="mt-4 grid grid-cols-2 gap-4"><label className="text-sm font-medium">Diskon (%)<input type="number" min={0} max={100} value={settings.voucherPercent} onChange={(e) => update("voucherPercent", Number(e.target.value))} className={inputClass} /></label><label className="text-sm font-medium">Maks. Diskon<input type="number" min={0} value={settings.maxDiscount} onChange={(e) => update("maxDiscount", Number(e.target.value))} className={inputClass} /></label></div></section>
						<section className="rounded-2xl border bg-white p-6 dark:border-zinc-800 dark:bg-black"><h2 className="text-lg font-bold">Operasional</h2><p className="mb-5 mt-1 text-sm text-zinc-500">Aktifkan atau matikan layanan toko.</p><div className="space-y-4">{([['codEnabled','Pembayaran COD','Pelanggan dapat membayar ketika barang diterima'],['eWalletEnabled','Pembayaran E-Wallet','Tampilkan GoPay, OVO, DANA, dan ShopeePay'],['maintenanceMode','Mode Pemeliharaan','Tandai toko sedang dalam pemeliharaan']] as const).map(([key,title,description]) => <label key={key} className="flex cursor-pointer items-center justify-between rounded-xl border p-4 dark:border-zinc-800"><span><span className="block text-sm font-semibold">{title}</span><span className="text-xs text-zinc-500">{description}</span></span><input type="checkbox" checked={settings[key]} onChange={(e) => update(key, e.target.checked)} className="h-5 w-5 accent-orange-500" /></label>)}</div></section>
					</div>
					<div className="mt-6 flex justify-between rounded-2xl border border-dashed border-zinc-300 p-5 dark:border-zinc-700"><div><p className="font-semibold">Reset pengaturan CMS</p><p className="text-sm text-zinc-500">Mengembalikan konfigurasi ke nilai awal.</p></div><button onClick={() => { if (confirm("Reset semua pengaturan CMS?")) setSettings(defaultCmsSettings); }} className="rounded-xl px-4 text-sm font-semibold text-red-600 hover:bg-red-50">Reset</button></div>
				</div>
			</main>
		</div>
	);
}

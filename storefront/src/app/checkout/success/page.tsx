import Link from "next/link";

export default function CheckoutSuccess() {
	return (
		<div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6 lg:px-8">
			<h1 className="text-2xl font-bold">Terima kasih!</h1>
			<p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Pesanan kamu sedang diproses.</p>
			<div className="mt-6 flex gap-4 justify-center">
				<Link href="/orders" className="rounded-lg border border-zinc-300 px-6 py-3 text-sm font-semibold hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900">Lihat Pesanan</Link>
				<Link href="/products" className="rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600">Belanja Lagi</Link>
			</div>
		</div>
	);
}



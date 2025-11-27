import Link from "next/link";

export default function Admin() {
	return (
		<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
			<div className="mb-6">
				<h1 className="text-2xl font-bold">Admin Panel</h1>
				<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Kelola semua aspek ecommerce</p>
			</div>

			<div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
				<Link
					href="/admin/dashboard"
					className="rounded-lg border border-orange-500 bg-orange-50 px-4 py-3 text-center font-semibold text-orange-600 dark:bg-orange-900/20"
				>
					Dashboard
				</Link>
				<Link
					href="/admin/products"
					className="rounded-lg border border-zinc-300 px-4 py-3 text-center hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
				>
					Produk
				</Link>
				<Link
					href="/admin/orders"
					className="rounded-lg border border-zinc-300 px-4 py-3 text-center hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
				>
					Pesanan
				</Link>
				<Link
					href="/admin/users"
					className="rounded-lg border border-zinc-300 px-4 py-3 text-center hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
				>
					User/Karyawan
				</Link>
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<Link
					href="/admin/products"
					className="rounded-lg border border-zinc-200 p-6 hover:shadow-lg dark:border-zinc-800"
				>
					<div className="mb-4 flex items-center gap-3">
						<div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
							<svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
							</svg>
						</div>
						<h2 className="text-lg font-semibold">Kelola Produk</h2>
					</div>
					<p className="text-sm text-zinc-600 dark:text-zinc-400">Tambah, edit, dan hapus produk</p>
				</Link>

				<Link
					href="/admin/orders"
					className="rounded-lg border border-zinc-200 p-6 hover:shadow-lg dark:border-zinc-800"
				>
					<div className="mb-4 flex items-center gap-3">
						<div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
							<svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
							</svg>
						</div>
						<h2 className="text-lg font-semibold">Kelola Pesanan</h2>
					</div>
					<p className="text-sm text-zinc-600 dark:text-zinc-400">Lihat dan update status pesanan</p>
				</Link>

				<Link
					href="/admin/users"
					className="rounded-lg border border-zinc-200 p-6 hover:shadow-lg dark:border-zinc-800"
				>
					<div className="mb-4 flex items-center gap-3">
						<div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/20">
							<svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
							</svg>
						</div>
						<h2 className="text-lg font-semibold">Kelola User & Karyawan</h2>
					</div>
					<p className="text-sm text-zinc-600 dark:text-zinc-400">Lihat dan kelola semua user dan karyawan</p>
				</Link>

				<Link
					href="/admin/create-account"
					className="rounded-lg border border-zinc-200 p-6 hover:shadow-lg dark:border-zinc-800"
				>
					<div className="mb-4 flex items-center gap-3">
						<div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900/20">
							<svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
							</svg>
						</div>
						<h2 className="text-lg font-semibold">Buat Akun Baru</h2>
					</div>
					<p className="text-sm text-zinc-600 dark:text-zinc-400">Buat akun admin atau karyawan baru</p>
				</Link>
			</div>
		</div>
	);
}



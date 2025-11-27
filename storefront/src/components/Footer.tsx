export default function Footer() {
	return (
		<footer className="border-t border-zinc-200 dark:border-zinc-800">
			<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
				<div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
					<div>
						<h3 className="text-sm font-semibold">Produk</h3>
						<ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
							<li><a href="#">Sepatu</a></li>
							<li><a href="#">Pakaian</a></li>
							<li><a href="#">Aksesoris</a></li>
						</ul>
					</div>
					<div>
						<h3 className="text-sm font-semibold">Bantuan</h3>
						<ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
							<li><a href="#">Status Pesanan</a></li>
							<li><a href="#">Pengiriman</a></li>
							<li><a href="#">Pengembalian</a></li>
						</ul>
					</div>
					<div>
						<h3 className="text-sm font-semibold">Perusahaan</h3>
						<ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
							<li><a href="#">Tentang Kami</a></li>
							<li><a href="#">Karir</a></li>
							<li><a href="#">Investor</a></li>
						</ul>
					</div>
					<div>
						<h3 className="text-sm font-semibold">Sosial</h3>
						<div className="mt-3 flex gap-4 text-zinc-600 dark:text-zinc-400">
							<a href="#" aria-label="Instagram">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line></svg>
							</a>
							<a href="#" aria-label="Twitter">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11 2.2.1 4.4-.6 6-2C3 14 1.5 9.5 3 6c2.2 2.6 5.6 4.2 9 4-.5-2.4 2.5-5 5-3.5 1 .1 3-1.5 3-1.5z"></path></svg>
							</a>
						</div>
					</div>
				</div>
				<div className="mt-10 flex items-center justify-between border-t border-zinc-200 pt-6 text-xs text-zinc-500 dark:border-zinc-800">
					<p>© {new Date().getFullYear()} BimaStore. All rights reserved.</p>
					<p>ID / IDR</p>
				</div>
			</div>
		</footer>
	);
}



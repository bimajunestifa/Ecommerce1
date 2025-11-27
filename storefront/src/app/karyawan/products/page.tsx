"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatIDR } from "@/lib/products";

export default function KaryawanProductsPage() {
	const { user, loading } = useAuth();
	const router = useRouter();
	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		if (!loading && !user) {
			router.push("/login");
		}
	}, [user, loading, router]);

	useEffect(() => {
		if (user) {
			fetchProducts();
		}
	}, [user]);

	const fetchProducts = async () => {
		try {
			const res = await fetch("/api/products");
			const data = await res.json();
			setProducts(data || []);
		} catch (error) {
			console.error("Error fetching products:", error);
		}
	};

	if (loading) {
		return <div className="mx-auto max-w-7xl px-4 py-16 text-center">Memuat...</div>;
	}

	if (!user) {
		return null;
	}

	return (
		<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Kelola Produk</h1>
					<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Lihat dan edit produk</p>
				</div>
				<Link href="/karyawan/add-product" className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
					Tambah Produk
				</Link>
			</div>

			<div className="mb-4 grid grid-cols-3 gap-4">
				<Link href="/karyawan" className="rounded-lg border border-zinc-300 px-4 py-3 text-center hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900">
					Pesanan
				</Link>
				<Link href="/karyawan/products" className="rounded-lg border border-orange-500 bg-orange-50 px-4 py-3 text-center font-semibold text-orange-600 dark:bg-orange-900/20">
					Produk
				</Link>
				<Link href="/karyawan/add-product" className="rounded-lg border border-zinc-300 px-4 py-3 text-center hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900">
					Tambah Produk
				</Link>
			</div>

			{products.length === 0 ? (
				<div className="rounded-lg border border-zinc-200 p-16 text-center dark:border-zinc-800">
					<p className="text-zinc-600 dark:text-zinc-400">Belum ada produk</p>
					<Link href="/karyawan/add-product" className="mt-4 inline-block rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600">
						Tambah Produk Pertama
					</Link>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{products.map((product) => (
						<div key={product.id} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
							<div className="aspect-square rounded-lg border bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 mb-4">
								{product.image && (
									<img src={product.image} alt={product.title} className="h-full w-full rounded-lg object-cover" />
								)}
							</div>
							<h3 className="font-semibold line-clamp-2">{product.title}</h3>
							<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 capitalize">{product.category}</p>
							<p className="mt-2 font-semibold">{formatIDR(product.price)}</p>
							<div className="mt-4 flex gap-2">
								<Link
									href={`/admin/edit/${product.id}`}
									className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-center text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
								>
									Edit
								</Link>
								<Link
									href={`/product/${product.id}`}
									className="flex-1 rounded-lg bg-orange-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-orange-600"
								>
									Lihat
								</Link>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

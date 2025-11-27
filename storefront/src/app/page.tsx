import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";

export default function Home() {
  return (
    <div className="bg-white dark:bg-black">
      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Koleksi Terbaru</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Lari Lebih Jauh, Nyaman Setiap Langkah</h1>
          <p className="mt-4 max-w-xl text-zinc-600 dark:text-zinc-400">Temukan sepatu lari, training, dan lifestyle dengan teknologi terbaru untuk performa terbaik.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/products" className="rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600">Belanja Sekarang</Link>
            <Link href="/products" className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900">Lihat Koleksi</Link>
          </div>
        </div>
      </section>
      <ProductGrid />
    </div>
  );
}

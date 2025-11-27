"use client";
import { useState } from "react";

type ImageURLHelperProps = {
	value: string;
	onChange: (url: string) => void;
};

const sampleImages = [
	{
		name: "Sepatu Running",
		url: "/images/sepatu-running.jpg",
	},
	{
		name: "Sepatu Training",
		url: "/images/sepatu-training.jpg",
	},
	{
		name: "Sepatu Lifestyle",
		url: "/images/sepatu-lifestyle.jpg",
	},
	{
		name: "Sepatu Basketball",
		url: "/images/sepatu-basketball.jpg",
	},
	{
		name: "Sepatu Running 2",
		url: "/images/sepatu-running-2.jpg",
	},
	{
		name: "Sepatu Casual",
		url: "/images/sepatu-casual.jpg",
	},
	{
		name: "Sepatu Sport",
		url: "/images/sepatu-sport.jpg",
	},
	{
		name: "Sepatu Sneakers",
		url: "/images/sepatu-sneakers.jpg",
	},
];

export default function ImageURLHelper({ value, onChange }: ImageURLHelperProps) {
	const [showHelper, setShowHelper] = useState(false);

	return (
		<div>
			<div className="flex items-center gap-2">
				<input
					type="text"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder="/images/nama-file.jpg atau https://..."
					className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900"
				/>
				<button
					type="button"
					onClick={() => setShowHelper(!showHelper)}
					className="rounded-lg border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
				>
					{showHelper ? "Sembunyikan" : "Pilih Gambar"}
				</button>
			</div>

			{showHelper && (
				<div className="mt-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
					<div className="mb-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
						<p className="mb-2 text-sm font-medium text-blue-900 dark:text-blue-200">Cara Menggunakan Gambar Lokal:</p>
						<div className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
							<p>1. <strong>Simpan gambar</strong> di folder <code className="bg-blue-100 px-1 rounded dark:bg-blue-900">public/images/</code></p>
							<p>2. <strong>Gunakan URL:</strong> <code className="bg-blue-100 px-1 rounded dark:bg-blue-900">/images/nama-file.jpg</code></p>
							<p>3. <strong>Format:</strong> JPG, PNG, atau WebP</p>
							<p>4. <strong>Contoh:</strong> Jika file adalah <code className="bg-blue-100 px-1 rounded dark:bg-blue-900">sepatu-nike.jpg</code>, gunakan <code className="bg-blue-100 px-1 rounded dark:bg-blue-900">/images/sepatu-nike.jpg</code></p>
						</div>
					</div>

					<div className="mb-4">
						<p className="mb-2 text-sm font-medium">Atau Gunakan URL Eksternal:</p>
						<div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
							<p>• Masukkan URL lengkap gambar dari internet</p>
							<p>• Contoh: <code className="bg-zinc-100 px-1 rounded dark:bg-zinc-800">https://example.com/gambar.jpg</code></p>
						</div>
					</div>

					<div>
						<p className="mb-2 text-sm font-medium">Gambar Sample (Klik untuk menggunakan):</p>
						<div className="grid grid-cols-4 gap-2">
							{sampleImages.map((img, idx) => (
								<button
									key={idx}
									type="button"
									onClick={() => {
										onChange(img.url);
										setShowHelper(false);
									}}
									className="group relative aspect-square overflow-hidden rounded-lg border border-zinc-200 hover:border-orange-500 dark:border-zinc-800"
								>
									<img
										src={img.url}
										alt={img.name}
										className="h-full w-full object-cover transition-transform group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
								</button>
							))}
						</div>
					</div>

					{value && (
						<div className="mt-4">
							<p className="mb-2 text-sm font-medium">Preview:</p>
							<div className="relative aspect-square max-w-xs overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
								<img src={value} alt="Preview" className="h-full w-full object-cover" onError={(e) => {
									(e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3EGambar tidak ditemukan%3C/text%3E%3C/svg%3E";
								}} />
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

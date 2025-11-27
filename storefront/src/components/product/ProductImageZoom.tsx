"use client";
import { useState } from "react";

type ProductImageZoomProps = {
	images: string[];
	title: string;
};

// Function to get high quality image URL
function getHighQualityImage(url: string): string {
	if (!url) return url;
	
	// For Unsplash images, add quality and size parameters for HD
	if (url.includes("unsplash.com")) {
		if (url.includes("?")) {
			// Replace existing params with HD params
			const baseUrl = url.split("?")[0];
			return `${baseUrl}?w=2000&h=2000&q=95&fit=max&auto=format`;
		}
		return `${url}?w=2000&h=2000&q=95&fit=max&auto=format`;
	}
	
	// For static.nike.com, use highest quality
	if (url.includes("static.nike.com")) {
		// Try to get highest quality version (1728px or 2000px)
		if (url.includes("t_web_pdp")) {
			return url.replace("t_web_pdp_535_v2", "t_PDP_1728_v1");
		}
		if (url.includes("t_PDP")) {
			return url.replace(/t_PDP_\d+_v\d+/, "t_PDP_1728_v1");
		}
		// If format is different, try to add quality param or return as is
		return url;
	}
	
	// For imgur, use large size
	if (url.includes("imgur.com") && url.includes("i.imgur.com")) {
		return url.replace(/\.(jpg|png|jpeg)$/i, "h.$1"); // h = large size
	}
	
	// Return original if no optimization needed
	return url;
}

export default function ProductImageZoom({ images, title }: ProductImageZoomProps) {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
	const [showZoom, setShowZoom] = useState(false);
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [lightboxIndex, setLightboxIndex] = useState(0);

	const mainImage = images[selectedIndex] || images[0];

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;
		setZoomPosition({ x, y });
		setShowZoom(true);
	};

	const handleMouseLeave = () => {
		setShowZoom(false);
	};

	const openLightbox = (index: number) => {
		setLightboxIndex(index);
		setLightboxOpen(true);
	};

	const closeLightbox = () => {
		setLightboxOpen(false);
	};

	const nextImage = () => {
		setLightboxIndex((prev) => (prev + 1) % images.length);
	};

	const prevImage = () => {
		setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
	};

	return (
		<>
			<div className="space-y-4">
				{/* Main Image with Zoom */}
				<div
					className="relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl border bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
					onMouseMove={handleMouseMove}
					onMouseLeave={handleMouseLeave}
					onClick={() => openLightbox(selectedIndex)}
				>
					{mainImage && (
						<img
							src={getHighQualityImage(mainImage)}
							alt={title}
							className="h-full w-full object-contain transition-transform duration-200"
							style={{
								transform: showZoom ? `scale(3)` : "scale(1)",
								transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
							}}
							loading="eager"
							decoding="async"
							fetchPriority="high"
						/>
					)}
					{showZoom && (
						<div className="pointer-events-none absolute inset-0 bg-black/5" />
					)}
					{/* Zoom Icon */}
					<div className="absolute bottom-4 right-4 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm dark:bg-zinc-900/80">
						<svg className="h-5 w-5 text-zinc-700 dark:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
						</svg>
					</div>
				</div>

				{/* Thumbnail Images */}
				{images.length > 1 && (
					<div className="grid grid-cols-4 gap-2">
						{images.map((img, idx) => (
							<button
								key={idx}
								onClick={() => setSelectedIndex(idx)}
								className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
									selectedIndex === idx
										? "border-orange-500 ring-2 ring-orange-200 dark:ring-orange-900/30"
										: "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
								}`}
							>
								<img
									src={getHighQualityImage(img)}
									alt={`${title} ${idx + 1}`}
									className="h-full w-full object-cover"
									loading="lazy"
								/>
							</button>
						))}
					</div>
				)}
			</div>

			{/* Lightbox Modal */}
			{lightboxOpen && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
					onClick={closeLightbox}
				>
					<button
						onClick={closeLightbox}
						className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm hover:bg-white/20"
					>
						<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>

					{images.length > 1 && (
						<>
							<button
								onClick={(e) => {
									e.stopPropagation();
									prevImage();
								}}
								className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm hover:bg-white/20"
							>
								<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
								</svg>
							</button>
							<button
								onClick={(e) => {
									e.stopPropagation();
									nextImage();
								}}
								className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm hover:bg-white/20"
							>
								<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
							</button>
						</>
					)}

					<div className="relative max-h-full max-w-7xl" onClick={(e) => e.stopPropagation()}>
						<img
							src={getHighQualityImage(images[lightboxIndex])}
							alt={`${title} ${lightboxIndex + 1}`}
							className="max-h-[95vh] w-auto rounded-lg object-contain"
							fetchPriority="high"
						/>
						{images.length > 1 && (
							<div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white backdrop-blur-sm">
								{lightboxIndex + 1} / {images.length}
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
}


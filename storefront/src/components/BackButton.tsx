"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

type BackButtonProps = {
	href?: string;
	label?: string;
	className?: string;
};

export function BackButton({ href, label = "Kembali", className = "" }: BackButtonProps) {
	const router = useRouter();

	const handleBack = () => {
		if (href) {
			router.push(href);
		} else {
			router.back();
		}
	};

	return (
		<button
			onClick={handleBack}
			className={`inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 ${className}`}
		>
			<svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
			</svg>
			{label}
		</button>
	);
}

export function BackLink({ href, label = "Kembali", className = "" }: BackButtonProps) {
	return (
		<Link
			href={href || "#"}
			className={`inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 ${className}`}
		>
			<svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
			</svg>
			{label}
		</Link>
	);
}


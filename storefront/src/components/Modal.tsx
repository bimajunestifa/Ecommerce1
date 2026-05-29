"use client";
import { useEffect } from "react";

type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
	size?: "sm" | "md" | "lg";
};

export function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	if (!isOpen) return null;

	const sizeClasses = {
		sm: "max-w-md",
		md: "max-w-lg",
		lg: "max-w-2xl",
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Backdrop */}
			<div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

			{/* Modal */}
			<div className={`relative w-full ${sizeClasses[size]} rounded-lg bg-white shadow-xl dark:bg-zinc-900`}>
				{/* Header */}
				<div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
					<h2 className="text-lg font-semibold">{title}</h2>
					<button
						onClick={onClose}
						className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
					>
						<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				{/* Content */}
				<div className="px-6 py-4">{children}</div>
			</div>
		</div>
	);
}

type ConfirmModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	variant?: "danger" | "warning" | "info";
};

export function ConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = "Konfirmasi",
	cancelText = "Batal",
	variant = "info",
}: ConfirmModalProps) {
	const variantClasses = {
		danger: "bg-red-500 hover:bg-red-600",
		warning: "bg-orange-500 hover:bg-orange-600",
		info: "bg-blue-500 hover:bg-blue-600",
	};

	const handleConfirm = () => {
		onConfirm();
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
			<div className="space-y-4">
				<p className="text-zinc-600 dark:text-zinc-400">{message}</p>
				<div className="flex justify-end gap-3">
					<button
						onClick={onClose}
						className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
					>
						{cancelText}
					</button>
					<button
						onClick={handleConfirm}
						className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${variantClasses[variant]}`}
					>
						{confirmText}
					</button>
				</div>
			</div>
		</Modal>
	);
}

type ToastProps = {
	message: string;
	type?: "success" | "error" | "info";
	onClose: () => void;
};

export function Toast({ message, type = "info", onClose }: ToastProps) {
	const typeClasses = {
		success: "bg-green-500 text-white",
		error: "bg-red-500 text-white",
		info: "bg-blue-500 text-white",
	};

	const icons = {
		success: (
			<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
			</svg>
		),
		error: (
			<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
			</svg>
		),
		info: (
			<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
		),
	};

	return (
		<div className="fixed bottom-4 right-4 z-50 animate-slide-up">
			<div className={`flex items-center gap-3 rounded-lg ${typeClasses[type]} px-4 py-3 shadow-lg`}>
				{icons[type]}
				<p className="text-sm font-medium">{message}</p>
				<button onClick={onClose} className="ml-2 hover:opacity-80">
					<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		</div>
	);
}


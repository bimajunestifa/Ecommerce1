"use client";

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


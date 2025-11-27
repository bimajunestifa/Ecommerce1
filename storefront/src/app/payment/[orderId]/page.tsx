import PaymentClient from "./PaymentClient";

// Required for static export - return array with dummy value since payment pages are user-specific
// This is only to satisfy the build requirement
export async function generateStaticParams() {
	return [{ orderId: 'dummy' }];
}

export default function PaymentPage() {
	return <PaymentClient />;
}

import OrderDetailClient from "./OrderDetailClient";
import { readOrders } from "@/lib/db";

// Required for static export - return array with dummy value since orders are user-specific
// This is only to satisfy the build requirement
export async function generateStaticParams() {
	return [{ id: 'dummy' }];
}

export default function OrderDetailPage() {
	return <OrderDetailClient />;
}

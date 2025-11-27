import { NextRequest, NextResponse } from "next/server";
import { readOrders, writeOrders, findOrderById } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = 'error';
export const dynamicParams = false;

// Required for static export - return empty array since API routes won't work in static export
export async function generateStaticParams() {
  return [];
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const order = findOrderById(id);
		if (!order) {
			return NextResponse.json({ error: "Order not found" }, { status: 404 });
		}

		// User hanya bisa lihat order mereka sendiri, admin/karyawan bisa lihat semua
		if (order.userId !== user.userId && user.role !== "admin" && user.role !== "karyawan") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		return NextResponse.json({ order });
	} catch (error) {
		return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
	}
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Hanya admin dan karyawan yang bisa update status
		if (user.role !== "admin" && user.role !== "karyawan") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const { status, trackingNumber, courier, estimatedDelivery } = await req.json();
		const orders = readOrders();
		const orderIndex = orders.findIndex((o) => o.id === id);

		if (orderIndex === -1) {
			return NextResponse.json({ error: "Order not found" }, { status: 404 });
		}

		const updateData: any = {
			status,
			updatedAt: new Date().toISOString(),
		};

		if (trackingNumber) {
			updateData.trackingNumber = trackingNumber;
		}

		if (courier) {
			updateData.courier = courier;
		}

		if (estimatedDelivery) {
			updateData.estimatedDelivery = estimatedDelivery;
		}

		// Generate tracking history when status changes to shipped
		if (status === "shipped" && trackingNumber) {
			const existingHistory = orders[orderIndex].trackingHistory || [];
			const newHistory = [
				...existingHistory,
				{
					status: "shipped",
					message: `Pesanan dikirim dengan nomor resi: ${trackingNumber}`,
					location: "Jakarta",
					timestamp: new Date().toISOString(),
				},
			];
			updateData.trackingHistory = newHistory;
		}

		orders[orderIndex] = {
			...orders[orderIndex],
			...updateData,
		};

		writeOrders(orders);
		return NextResponse.json({ order: orders[orderIndex], message: "Status updated" });
	} catch (error) {
		return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
	}
}

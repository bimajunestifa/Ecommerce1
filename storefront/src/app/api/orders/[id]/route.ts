import { NextRequest, NextResponse } from "next/server";
import { readOrders, writeOrders, findOrderById } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = 'force-dynamic';

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
		console.error("Error fetching order:", error);
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
			return NextResponse.json({ error: "Forbidden: Hanya admin dan karyawan yang bisa update status" }, { status: 403 });
		}

		// Parse request body dengan error handling
		let body;
		try {
			body = await req.json();
		} catch (parseError) {
			return NextResponse.json({ 
				error: "Invalid request body",
				details: "Request body harus berupa JSON"
			}, { status: 400 });
		}

		const { status, trackingNumber, courier, estimatedDelivery } = body;

		if (!status) {
			return NextResponse.json({ error: "Status diperlukan" }, { status: 400 });
		}

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
		return NextResponse.json({ 
			order: orders[orderIndex], 
			message: "Status updated" 
		}, {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		console.error("Error updating order status:", error);
		const errorMessage = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ 
			error: "Gagal mengupdate status pesanan",
			details: errorMessage
		}, { 
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}

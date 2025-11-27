import { NextRequest, NextResponse } from "next/server";
import { readOrders } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = 'error';

export async function GET(req: NextRequest) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Admin dan karyawan bisa lihat semua pesanan
		if (user.role !== "admin" && user.role !== "karyawan") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const orders = readOrders();
		return NextResponse.json({ orders });
	} catch (error) {
		return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
	}
}


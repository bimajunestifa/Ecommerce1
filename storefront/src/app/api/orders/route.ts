export const dynamic = 'error';\nimport { NextRequest, NextResponse } from "next/server";
import { createOrder, findOrdersByUserId } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const orders = findOrdersByUserId(user.userId);
		return NextResponse.json({ orders });
	} catch (error) {
		return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { items, total, shippingAddress, paymentMethod } = await req.json();

		if (!items || !total || !shippingAddress || !paymentMethod) {
			return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
		}

		const order = createOrder({
			userId: user.userId,
			items,
			total,
			status: "pending",
			shippingAddress,
			paymentMethod,
		});

		return NextResponse.json({ order, message: "Order berhasil dibuat" });
	} catch (error) {
		return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
	}
}


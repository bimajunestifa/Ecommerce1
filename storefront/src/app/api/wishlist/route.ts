import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { findUserById, writeUsers } from "@/lib/db";

export async function GET(req: NextRequest) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ wishlist: [] });
		}

		const userData = findUserById(user.userId);
		return NextResponse.json({ wishlist: userData?.wishlist || [] });
	} catch (error) {
		return NextResponse.json({ wishlist: [] });
	}
}

export async function POST(req: NextRequest) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { productId } = await req.json();
		if (!productId) {
			return NextResponse.json({ error: "ProductId diperlukan" }, { status: 400 });
		}

		const users = await import("@/lib/db").then(m => m.readUsers());
		const userData = users.find(u => u.id === user.userId);
		if (!userData) {
			return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
		}

		const wishlist = userData.wishlist || [];
		if (wishlist.includes(productId)) {
			return NextResponse.json({ message: "Produk sudah ada di wishlist" });
		}

		userData.wishlist = [...wishlist, productId];
		writeUsers(users);

		return NextResponse.json({ wishlist: userData.wishlist, message: "Produk ditambahkan ke wishlist" });
	} catch (error) {
		return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { productId } = await req.json();
		if (!productId) {
			return NextResponse.json({ error: "ProductId diperlukan" }, { status: 400 });
		}

		const users = await import("@/lib/db").then(m => m.readUsers());
		const userData = users.find(u => u.id === user.userId);
		if (!userData) {
			return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
		}

		userData.wishlist = (userData.wishlist || []).filter(id => id !== productId);
		writeUsers(users);

		return NextResponse.json({ wishlist: userData.wishlist, message: "Produk dihapus dari wishlist" });
	} catch (error) {
		return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
	}
}

import { NextRequest, NextResponse } from "next/server";
import { readUsers, writeUsers } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = 'error';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const user = await getCurrentUser();
		if (!user || user.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Jangan hapus diri sendiri
		if (id === user.userId) {
			return NextResponse.json({ error: "Tidak bisa menghapus akun sendiri" }, { status: 400 });
		}

		const users = readUsers();
		const filtered = users.filter((u) => u.id !== id);

		if (filtered.length === users.length) {
			return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
		}

		writeUsers(filtered);
		return NextResponse.json({ message: "User berhasil dihapus" });
	} catch (error) {
		return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
	}
}

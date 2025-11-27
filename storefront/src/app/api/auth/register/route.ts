export const dynamic = 'error';\nimport { NextRequest, NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
	try {
		const { email, password, name, role } = await req.json();

		if (!email || !password || !name) {
			return NextResponse.json({ error: "Email, password, dan name diperlukan" }, { status: 400 });
		}

		if (findUserByEmail(email)) {
			return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
		}

		// Hanya admin yang bisa membuat akun admin/karyawan
		const currentUser = await import("@/lib/auth").then(m => m.getCurrentUser());
		const requestedRole = role || "user";
		
		if (requestedRole !== "user" && (!currentUser || currentUser.role !== "admin")) {
			return NextResponse.json({ error: "Unauthorized: Hanya admin yang bisa membuat akun admin/karyawan" }, { status: 403 });
		}

		const hashedPassword = await hashPassword(password);
		const user = createUser({
			email,
			password: hashedPassword,
			name,
			role: requestedRole as "user" | "admin" | "karyawan",
		});

		return NextResponse.json({ 
			user: { id: user.id, email: user.email, name: user.name, role: user.role },
			message: "Registrasi berhasil" 
		});
	} catch (error) {
		return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
	}
}


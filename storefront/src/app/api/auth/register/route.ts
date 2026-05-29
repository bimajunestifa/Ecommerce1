import { NextRequest, NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
	try {
		// Parse request body dengan error handling
		let body;
		try {
			body = await req.json();
		} catch (parseError) {
			return NextResponse.json({ 
				error: "Invalid request body",
				details: "Request body harus berupa JSON"
			}, { 
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const { email, password, name, role } = body;

		if (!email || !password || !name) {
			return NextResponse.json({ 
				error: "Email, password, dan name diperlukan" 
			}, { 
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Validasi email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json({ 
				error: "Format email tidak valid" 
			}, { 
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Validasi password length
		if (password.length < 6) {
			return NextResponse.json({ 
				error: "Password minimal 6 karakter" 
			}, { 
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		if (findUserByEmail(email)) {
			return NextResponse.json({ 
				error: "Email sudah terdaftar" 
			}, { 
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Hanya admin yang bisa membuat akun admin/karyawan
		let currentUser = null;
		try {
			const authModule = await import("@/lib/auth");
			currentUser = await authModule.getCurrentUser();
		} catch (authError) {
			// Jika tidak ada user yang login, itu OK untuk registrasi user biasa
		}
		
		const requestedRole = role || "user";
		
		if (requestedRole !== "user" && (!currentUser || currentUser.role !== "admin")) {
			return NextResponse.json({ 
				error: "Unauthorized: Hanya admin yang bisa membuat akun admin/karyawan" 
			}, { 
				status: 403,
				headers: { 'Content-Type': 'application/json' }
			});
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
		}, {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error("Error during registration:", error);
		const errorMessage = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ 
			error: "Terjadi kesalahan saat registrasi",
			details: errorMessage
		}, { 
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}


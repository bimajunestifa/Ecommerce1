import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/db";
import { comparePassword, generateToken } from "@/lib/auth";
import { cookies } from "next/headers";

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
			}, { status: 400 });
		}

		const { email, password } = body;

		if (!email || !password) {
			return NextResponse.json({ error: "Email dan password diperlukan" }, { status: 400 });
		}

		const user = findUserByEmail(email);
		if (!user) {
			return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
		}

		const isValid = await comparePassword(password, user.password);
		if (!isValid) {
			return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
		}

		const token = generateToken(user.id, user.email, user.role);
		const cookieStore = await cookies();
		cookieStore.set("auth-token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 7, // 7 days
			path: "/", // Pastikan path root
		});

		return NextResponse.json({ 
			user: { id: user.id, email: user.email, name: user.name, role: user.role },
			message: "Login berhasil" 
		});
	} catch (error) {
		console.error("Login error:", error);
		const errorMessage = error instanceof Error ? error.message : "Unknown error";
		const errorStack = error instanceof Error ? error.stack : undefined;
		
		return NextResponse.json({ 
			error: "Terjadi kesalahan saat login",
			details: errorMessage,
			...(process.env.NODE_ENV === "development" && { stack: errorStack })
		}, { 
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}


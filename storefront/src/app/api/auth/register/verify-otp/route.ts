import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createUser, findUserByEmail } from "@/lib/db";
import { generateToken, hashPassword } from "@/lib/auth";
import { verifyStoredOtp } from "@/lib/loginOtp";

export const dynamic = "force-dynamic";

function isValidEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
	try {
		let body;

		try {
			body = await req.json();
		} catch {
			return NextResponse.json({ error: "Request body harus berupa JSON" }, { status: 400 });
		}

		const { name, email, password, otp } = body;

		if (!name || !email || !password || !otp) {
			return NextResponse.json(
				{ error: "Nama, email, password, dan OTP diperlukan" },
				{ status: 400 },
			);
		}

		if (!isValidEmail(email)) {
			return NextResponse.json({ error: "Format email tidak valid" }, { status: 400 });
		}

		if (String(password).length < 6) {
			return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });
		}

		if (!/^\d{6}$/.test(String(otp))) {
			return NextResponse.json({ error: "OTP harus 6 digit angka" }, { status: 400 });
		}

		if (findUserByEmail(email)) {
			return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
		}

		const isValidOtp = verifyStoredOtp(email, String(otp), "register");
		if (!isValidOtp) {
			return NextResponse.json(
				{ error: "OTP tidak valid atau sudah kedaluwarsa" },
				{ status: 401 },
			);
		}

		const hashedPassword = await hashPassword(password);
		const user = createUser({
			email,
			password: hashedPassword,
			name,
			role: "user",
		});

		const token = generateToken(user.id, user.email, user.role);
		const cookieStore = await cookies();
		cookieStore.set("auth-token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 7,
			path: "/",
		});

		return NextResponse.json({
			user: { id: user.id, email: user.email, name: user.name, role: user.role },
			message: "Registrasi berhasil",
		});
	} catch (error) {
		console.error("Register verify OTP error:", error);
		const message = error instanceof Error ? error.message : "Terjadi kesalahan saat verifikasi OTP";

		return NextResponse.json({ error: message }, { status: 500 });
	}
}

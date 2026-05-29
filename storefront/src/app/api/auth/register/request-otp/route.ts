import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/db";
import { generateAndStoreOtp } from "@/lib/loginOtp";
import { sendRegisterOtpEmail } from "@/lib/email";

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

		const { name, email, password } = body;

		if (!name || !email || !password) {
			return NextResponse.json(
				{ error: "Nama, email, dan password diperlukan" },
				{ status: 400 },
			);
		}

		if (!isValidEmail(email)) {
			return NextResponse.json({ error: "Format email tidak valid" }, { status: 400 });
		}

		if (String(password).length < 6) {
			return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });
		}

		if (findUserByEmail(email)) {
			return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
		}

		const { otp, expiresAt } = generateAndStoreOtp(email, "register");
		await sendRegisterOtpEmail(email, otp);

		return NextResponse.json({
			message: "Kode OTP verifikasi sudah dikirim ke email Anda",
			expiresAt,
		});
	} catch (error) {
		console.error("Register request OTP error:", error);
		const message = error instanceof Error ? error.message : "Terjadi kesalahan saat mengirim OTP";

		return NextResponse.json({ error: message }, { status: 500 });
	}
}

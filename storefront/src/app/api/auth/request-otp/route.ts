import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/db";
import { comparePassword } from "@/lib/auth";
import { sendLoginOtpEmail } from "@/lib/email";
import { generateAndStoreOtp } from "@/lib/loginOtp";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
	try {
		let body;

		try {
			body = await req.json();
		} catch {
			return NextResponse.json(
				{ error: "Request body harus berupa JSON" },
				{ status: 400 },
			);
		}

		const { email, password } = body;

		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email dan password diperlukan" },
				{ status: 400 },
			);
		}

		const user = findUserByEmail(email);
		if (!user) {
			return NextResponse.json(
				{ error: "Email atau password salah" },
				{ status: 401 },
			);
		}

		const isValidPassword = await comparePassword(password, user.password);
		if (!isValidPassword) {
			return NextResponse.json(
				{ error: "Email atau password salah" },
				{ status: 401 },
			);
		}

		const { otp, expiresAt } = generateAndStoreOtp(email, "login");
		await sendLoginOtpEmail(email, otp);

		return NextResponse.json({
			message: "Kode OTP berhasil dikirim ke email Anda",
			expiresAt,
		});
	} catch (error) {
		console.error("Request OTP error:", error);
		const message = error instanceof Error ? error.message : "Terjadi kesalahan saat mengirim OTP";

		return NextResponse.json(
			{ error: message },
			{ status: 500 },
		);
	}
}

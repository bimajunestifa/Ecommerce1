import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { findUserByEmail } from "@/lib/db";
import { generateToken } from "@/lib/auth";
import { verifyStoredOtp } from "@/lib/loginOtp";

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

		const { email, otp } = body;

		if (!email || !otp) {
			return NextResponse.json(
				{ error: "Email dan OTP diperlukan" },
				{ status: 400 },
			);
		}

		if (!/^\d{6}$/.test(String(otp))) {
			return NextResponse.json(
				{ error: "OTP harus 6 digit angka" },
				{ status: 400 },
			);
		}

		const user = findUserByEmail(email);
		if (!user) {
			return NextResponse.json(
				{ error: "User tidak ditemukan" },
				{ status: 404 },
			);
		}

		const isValidOtp = verifyStoredOtp(email, String(otp), "login");
		if (!isValidOtp) {
			return NextResponse.json(
				{ error: "OTP tidak valid atau sudah kedaluwarsa" },
				{ status: 401 },
			);
		}

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
			message: "OTP valid, login berhasil",
		});
	} catch (error) {
		console.error("Verify OTP error:", error);
		const message = error instanceof Error ? error.message : "Terjadi kesalahan saat verifikasi OTP";

		return NextResponse.json(
			{ error: message },
			{ status: 500 },
		);
	}
}

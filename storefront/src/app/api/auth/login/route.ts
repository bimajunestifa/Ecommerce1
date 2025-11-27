import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/db";
import { comparePassword, generateToken } from "@/lib/auth";
import { cookies } from "next/headers";

export const dynamic = 'error';

export async function POST(req: NextRequest) {
	try {
		const { email, password } = await req.json();

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
		});

		return NextResponse.json({ 
			user: { id: user.id, email: user.email, name: user.name, role: user.role },
			message: "Login berhasil" 
		});
	} catch (error) {
		return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
	}
}


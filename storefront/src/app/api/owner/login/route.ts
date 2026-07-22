import { COOKIE_NAME, createOwnerSession, SESSION_SECONDS } from "@/lib/ownerAuth";
import { NextRequest, NextResponse } from "next/server";

type Attempt = { count: number; resetAt: number };
const attempts = new Map<string, Attempt>();

function safeEqual(left: string, right: string) {
	if (left.length !== right.length) return false;
	let result = 0;
	for (let index = 0; index < left.length; index++) result |= left.charCodeAt(index) ^ right.charCodeAt(index);
	return result === 0;
}

export async function POST(request: NextRequest) {
	const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
	const now = Date.now();
	const record = attempts.get(ip);
	if (record && record.resetAt > now && record.count >= 5) return NextResponse.json({ error: "Terlalu banyak percobaan. Coba lagi dalam 15 menit." }, { status: 429 });

	const email = process.env.OWNER_EMAIL;
	const password = process.env.OWNER_PASSWORD;
	if (!email || !password || password.length < 12) return NextResponse.json({ error: "Akun owner belum dikonfigurasi dengan aman di server." }, { status: 503 });

	const body = await request.json().catch(() => ({}));
	const valid = safeEqual(String(body.email || "").toLowerCase(), email.toLowerCase()) && safeEqual(String(body.password || ""), password);
	if (!valid) {
		attempts.set(ip, { count: record && record.resetAt > now ? record.count + 1 : 1, resetAt: now + 15 * 60 * 1000 });
		return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
	}

	attempts.delete(ip);
	const response = NextResponse.json({ ok: true });
	response.cookies.set(COOKIE_NAME, await createOwnerSession(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: SESSION_SECONDS });
	return response;
}

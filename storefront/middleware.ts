import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const isAdmin = pathname.startsWith("/admin");
	const isStaff = pathname.startsWith("/petugas");
	if (!isAdmin && !isStaff) return NextResponse.next();

	const user = isAdmin
		? process.env.BASIC_AUTH_USER ?? "admin"
		: process.env.STAFF_AUTH_USER ?? "staff";
	const pass = isAdmin
		? process.env.BASIC_AUTH_PASS ?? "admin123"
		: process.env.STAFF_AUTH_PASS ?? "staff123";
	const auth = request.headers.get("authorization");
	if (!auth?.startsWith("Basic ")) return unauthorized();

	const [, encoded] = auth.split(" ");
	try {
		const decoded = Buffer.from(encoded, "base64").toString("utf-8");
		const [u, p] = decoded.split(":");
		if (u === user && p === pass) return NextResponse.next();
		return unauthorized();
	} catch {
		return unauthorized();
	}
}

function unauthorized() {
	return new NextResponse("Unauthorized", {
		status: 401,
		headers: { "WWW-Authenticate": "Basic realm=Protected" },
	});
}

export const config = {
	matcher: ["/admin/:path*", "/petugas/:path*"],
};



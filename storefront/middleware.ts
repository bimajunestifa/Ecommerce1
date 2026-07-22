import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, verifyOwnerSession } from "./src/lib/ownerAuth";

export async function middleware(request: NextRequest) {
	const { pathname, search } = request.nextUrl;
	const response = NextResponse.next();
	setSecurityHeaders(response);

	if (!pathname.startsWith("/admin") || pathname === "/admin/login") return response;
	const authenticated = await verifyOwnerSession(request.cookies.get(COOKIE_NAME)?.value);
	if (authenticated) return response;

	const login = new URL("/admin/login", request.url);
	login.searchParams.set("next", `${pathname}${search}`);
	const redirect = NextResponse.redirect(login);
	redirect.cookies.delete(COOKIE_NAME);
	setSecurityHeaders(redirect);
	return redirect;
}

function setSecurityHeaders(response: NextResponse) {
	response.headers.set("X-Frame-Options", "DENY");
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
	response.headers.set("Content-Security-Policy", "frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
}

export const config = { matcher: ["/admin/:path*"] };

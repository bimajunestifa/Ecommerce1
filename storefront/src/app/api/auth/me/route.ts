export const dynamic = 'error';\nimport { NextResponse } from "next/server";
import { getCurrentUser, verifyToken } from "@/lib/auth";
import { findUserById } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET() {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get("auth-token")?.value;
		
		if (!token) {
			return NextResponse.json({ user: null }, { status: 200 });
		}

		const decoded = verifyToken(token);
		if (!decoded) {
			return NextResponse.json({ user: null }, { status: 200 });
		}

		const user = findUserById(decoded.userId);
		if (!user) {
			return NextResponse.json({ user: null }, { status: 200 });
		}

		return NextResponse.json({ 
			user: { 
				id: user.id, 
				email: user.email, 
				name: user.name, 
				role: user.role,
				avatar: user.avatar,
				phone: user.phone,
			} 
		});
	} catch (error) {
		return NextResponse.json({ user: null }, { status: 200 });
	}
}


import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export async function POST() {
	try {
		const cookieStore = await cookies();
		// Delete cookie with same path as when it was set
		cookieStore.delete({ name: "auth-token", path: "/" });
		return NextResponse.json({ 
			message: "Logout berhasil" 
		}, {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		console.error("Error during logout:", error);
		return NextResponse.json({ 
			error: "Gagal logout",
			message: "Terjadi kesalahan saat logout"
		}, { 
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}


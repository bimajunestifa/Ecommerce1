import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = 'error';

export async function POST() {
	const cookieStore = await cookies();
	cookieStore.delete("auth-token");
	return NextResponse.json({ message: "Logout berhasil" });
}


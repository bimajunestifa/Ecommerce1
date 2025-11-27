import { NextRequest, NextResponse } from "next/server";
import { readUsers } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
	try {
		const user = await getCurrentUser();
		if (!user || user.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const users = readUsers();
		// Jangan kirim password
		const usersWithoutPassword = users.map(({ password, ...rest }) => rest);

		return NextResponse.json({ users: usersWithoutPassword });
	} catch (error) {
		return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
	}
}

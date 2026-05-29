import { NextRequest, NextResponse } from "next/server";
import { readUsers, writeUsers, findUserById } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Parse request body
		let body;
		try {
			body = await req.json();
		} catch (parseError) {
			return NextResponse.json({ 
				error: "Invalid request body",
				details: "Request body harus berupa JSON"
			}, { 
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const { name, phone } = body;

		if (!name || name.trim().length === 0) {
			return NextResponse.json({ 
				error: "Nama diperlukan" 
			}, { 
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const users = readUsers();
		const userIndex = users.findIndex((u) => u.id === user.userId);

		if (userIndex === -1) {
			return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
		}

		// Update user data
		users[userIndex] = {
			...users[userIndex],
			name: name.trim(),
			phone: phone ? phone.trim() : undefined,
			updatedAt: new Date().toISOString(),
		};

		writeUsers(users);

		return NextResponse.json({ 
			user: { 
				id: users[userIndex].id, 
				email: users[userIndex].email, 
				name: users[userIndex].name, 
				role: users[userIndex].role,
				phone: users[userIndex].phone,
			},
			message: "Profile berhasil diupdate" 
		}, {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error("Error updating profile:", error);
		const errorMessage = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ 
			error: "Gagal mengupdate profile",
			details: errorMessage
		}, { 
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}


import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
	return bcrypt.compare(password, hash);
}

export function generateToken(userId: string, email: string, role: string): string {
	return jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string; email: string; role: string } | null {
	try {
		return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
	} catch {
		return null;
	}
}

export async function getCurrentUser() {
	const cookieStore = await cookies();
	const token = cookieStore.get("auth-token")?.value;
	if (!token) return null;
	return verifyToken(token);
}

// Script untuk test login langsung
// Jalankan dengan: npx tsx scripts/test-login.ts

import { findUserByEmail } from "../src/lib/db";
import { comparePassword, generateToken } from "../src/lib/auth";

async function testLogin() {
	const testAccounts = [
		{ email: "admin@test.com", password: "admin123" },
		{ email: "admin@admin.com", password: "admin123" },
		{ email: "admin@bimastore.com", password: "admin123" },
	];

	console.log("🧪 Testing Login...\n");

	for (const account of testAccounts) {
		console.log(`Testing: ${account.email}`);
		
		const user = findUserByEmail(account.email);
		
		if (!user) {
			console.log(`  ❌ User tidak ditemukan\n`);
			continue;
		}

		console.log(`  ✅ User ditemukan: ${user.name} (${user.role})`);

		const isValid = await comparePassword(account.password, user.password);
		
		if (isValid) {
			console.log(`  ✅ Password VALID`);
			
			// Test generate token
			try {
				const token = generateToken(user.id, user.email, user.role);
				console.log(`  ✅ Token berhasil dibuat: ${token.substring(0, 20)}...`);
			} catch (error) {
				console.log(`  ❌ Error membuat token:`, error);
			}
		} else {
			console.log(`  ❌ Password TIDAK VALID`);
		}
		
		console.log("");
	}
}

testLogin().catch(console.error);


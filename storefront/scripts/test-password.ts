// Script untuk test password admin
// Jalankan dengan: npx tsx scripts/test-password.ts

import { readUsers, findUserByEmail } from "../src/lib/db";
import { comparePassword } from "../src/lib/auth";

async function testPassword() {
	const email = "admin@admin.com";
	const password = "admin123";

	const user = findUserByEmail(email);
	
	if (!user) {
		console.log(`❌ User dengan email ${email} tidak ditemukan`);
		return;
	}

	console.log(`✅ User ditemukan: ${user.name}`);
	console.log(`   Email: ${user.email}`);
	console.log(`   Role: ${user.role}`);
	console.log(`   Password hash: ${user.password.substring(0, 20)}...`);

	const isValid = await comparePassword(password, user.password);
	
	if (isValid) {
		console.log(`\n✅ Password "${password}" VALID!`);
	} else {
		console.log(`\n❌ Password "${password}" TIDAK VALID!`);
		console.log(`\nMencoba membuat ulang password hash...`);
		
		// Test dengan membuat hash baru
		const { hashPassword } = await import("../src/lib/auth");
		const newHash = await hashPassword(password);
		console.log(`Hash baru: ${newHash}`);
		
		const isValidNew = await comparePassword(password, newHash);
		console.log(`Test dengan hash baru: ${isValidNew ? "✅ VALID" : "❌ TIDAK VALID"}`);
	}
}

testPassword().catch(console.error);


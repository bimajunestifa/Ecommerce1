// Script untuk reset password akun admin/karyawan
// Jalankan dengan: npx tsx scripts/reset-password.ts

import { readUsers, writeUsers, findUserByEmail } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth";

async function resetPasswords() {
	const accounts = [
		{
			email: "admin@test.com",
			password: "admin123",
		},
		{
			email: "karyawan@test.com",
			password: "karyawan123",
		},
		{
			email: "admin@admin.com",
			password: "admin123",
		},
		{
			email: "admin@bimastore.com",
			password: "admin123",
		},
		{
			email: "karyawan@bimastore.com",
			password: "karyawan123",
		},
	];

	const users = readUsers();
	let updated = 0;

	for (const account of accounts) {
		const user = findUserByEmail(account.email);
		
		if (!user) {
			console.log(`⚠️  User dengan email ${account.email} tidak ditemukan`);
			continue;
		}

		// Hash password baru
		const hashedPassword = await hashPassword(account.password);

		// Update password
		const userIndex = users.findIndex(u => u.id === user.id);
		if (userIndex !== -1) {
			users[userIndex].password = hashedPassword;
			updated++;
			console.log(`✅ Password untuk ${account.email} berhasil di-reset`);
		}
	}

	if (updated > 0) {
		writeUsers(users);
		console.log(`\n✅ Total ${updated} password berhasil di-reset!\n`);
	} else {
		console.log("\n⚠️  Tidak ada password yang di-reset\n");
	}

	// Tampilkan semua kredensial
	console.log("📋 Kredensial Login (Password sudah di-reset):");
	console.log("=".repeat(60));
	
	for (const account of accounts) {
		const user = findUserByEmail(account.email);
		if (user) {
			console.log(`\n✅ ${user.name}`);
			console.log(`   Email: ${account.email}`);
			console.log(`   Password: ${account.password}`);
			console.log(`   Role: ${user.role}`);
		}
	}
	
	console.log("\n" + "=".repeat(60));
}

resetPasswords().catch(console.error);


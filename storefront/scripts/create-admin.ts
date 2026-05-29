// Script untuk membuat akun admin dan karyawan baru
// Jalankan dengan: npx tsx scripts/create-admin.ts

import { readUsers, writeUsers, findUserByEmail } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth";
import crypto from "crypto";

async function createAccounts() {
	const accounts = [
		{
			email: "admin@test.com",
			password: "admin123",
			name: "Admin Test",
			role: "admin" as const,
		},
		{
			email: "karyawan@test.com",
			password: "karyawan123",
			name: "Karyawan Test",
			role: "karyawan" as const,
		},
	];

	const users = readUsers();
	const newAccounts = [];
	const skippedAccounts = [];

	for (const account of accounts) {
		// Cek apakah email sudah ada
		if (findUserByEmail(account.email)) {
			console.log(`⚠️  Email ${account.email} sudah terdaftar, dilewati`);
			skippedAccounts.push(account);
			continue;
		}

		// Hash password
		const hashedPassword = await hashPassword(account.password);

		// Buat user baru
		const newUser = {
			id: crypto.randomUUID(),
			email: account.email,
			name: account.name,
			password: hashedPassword,
			role: account.role,
			createdAt: new Date().toISOString(),
		};

		users.push(newUser);
		newAccounts.push(account);
	}

	// Simpan ke database jika ada akun baru
	if (newAccounts.length > 0) {
		writeUsers(users);
		console.log(`\n✅ ${newAccounts.length} akun berhasil dibuat!\n`);
	} else {
		console.log("\n⚠️  Semua akun sudah ada\n");
	}

	// Tampilkan semua kredensial
	console.log("📋 Kredensial Login:");
	console.log("=" .repeat(50));
	
	for (const account of accounts) {
		const status = newAccounts.some(a => a.email === account.email) ? "✅ BARU" : "ℹ️  SUDAH ADA";
		console.log(`\n${status}`);
		console.log(`   Email: ${account.email}`);
		console.log(`   Password: ${account.password}`);
		console.log(`   Role: ${account.role}`);
		console.log(`   Nama: ${account.name}`);
	}
	
	console.log("\n" + "=".repeat(50));
	console.log("\n⚠️  Simpan kredensial ini dengan aman!");
}

createAccounts().catch(console.error);


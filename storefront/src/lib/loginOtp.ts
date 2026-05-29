import crypto from "crypto";
import fs from "fs";
import path from "path";

type LoginOtpRecord = {
	email: string;
	codeHash: string;
	createdAt: string;
	expiresAt: string;
	purpose: "login" | "register";
};

const dataDir = path.join(process.cwd(), "data");
const otpPath = path.join(dataDir, "login-otps.json");

function ensureOtpFile() {
	if (!fs.existsSync(dataDir)) {
		fs.mkdirSync(dataDir, { recursive: true });
	}

	if (!fs.existsSync(otpPath)) {
		fs.writeFileSync(otpPath, JSON.stringify([], null, 2), "utf-8");
	}
}

function readOtpRecords(): LoginOtpRecord[] {
	ensureOtpFile();
	const raw = fs.readFileSync(otpPath, "utf-8");

	try {
		const parsed = JSON.parse(raw) as LoginOtpRecord[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

function writeOtpRecords(records: LoginOtpRecord[]) {
	ensureOtpFile();
	fs.writeFileSync(otpPath, JSON.stringify(records, null, 2), "utf-8");
}

function getOtpExpiryMinutes() {
	const value = Number(process.env.OTP_EXPIRES_MINUTES || 10);
	return Number.isFinite(value) ? Math.min(Math.max(value, 1), 30) : 10;
}

function hashOtp(otp: string) {
	return crypto.createHash("sha256").update(otp).digest("hex");
}

function removeExpired(records: LoginOtpRecord[]) {
	const now = Date.now();
	return records.filter((record) => new Date(record.expiresAt).getTime() > now);
}

export function generateAndStoreOtp(email: string, purpose: LoginOtpRecord["purpose"]) {
	const otp = crypto.randomInt(0, 1000000).toString().padStart(6, "0");
	const records = removeExpired(readOtpRecords()).filter(
		(record) => !(record.email === email && record.purpose === purpose),
	);
	const expiresAt = new Date(Date.now() + getOtpExpiryMinutes() * 60 * 1000).toISOString();

	records.push({
		email,
		codeHash: hashOtp(otp),
		createdAt: new Date().toISOString(),
		expiresAt,
		purpose,
	});

	writeOtpRecords(records);

	return {
		otp,
		expiresAt,
	};
}

export function verifyStoredOtp(email: string, otp: string, purpose: LoginOtpRecord["purpose"]) {
	const records = removeExpired(readOtpRecords());
	const record = records.find((item) => item.email === email && item.purpose === purpose);

	if (!record) {
		writeOtpRecords(records);
		return false;
	}

	const isValid = record.codeHash === hashOtp(otp);
	const nextRecords = isValid
		? records.filter((item) => !(item.email === email && item.purpose === purpose))
		: records;

	writeOtpRecords(nextRecords);

	return isValid;
}

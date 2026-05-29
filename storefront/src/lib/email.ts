import nodemailer from "nodemailer";

const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.gmail.com";
const EMAIL_PORT = Number(process.env.EMAIL_PORT || 465);
const EMAIL_USER = process.env.EMAIL_USER || process.env.EMAIL_FROM;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || EMAIL_USER;
const APP_NAME = process.env.APP_NAME || "Bima Store";

function getTransporter() {
	if (!EMAIL_USER || !EMAIL_PASS) {
		throw new Error("OTP email belum aktif. Isi EMAIL_FROM atau EMAIL_USER, lalu isi EMAIL_PASS di .env.local.");
	}

	return nodemailer.createTransport({
		host: EMAIL_HOST,
		port: EMAIL_PORT,
		secure: EMAIL_PORT === 465,
		auth: {
			user: EMAIL_USER,
			pass: EMAIL_PASS,
		},
	});
}

export async function sendLoginOtpEmail(to: string, otp: string) {
	await sendOtpEmail({
		to,
		otp,
		title: "Kode OTP Login",
		intro: `Gunakan kode berikut untuk menyelesaikan login ke ${APP_NAME}:`,
	});
}

export async function sendRegisterOtpEmail(to: string, otp: string) {
	await sendOtpEmail({
		to,
		otp,
		title: "Kode OTP Verifikasi Email",
		intro: `Gunakan kode berikut untuk menyelesaikan pendaftaran akun ${APP_NAME}:`,
	});
}

async function sendOtpEmail({
	to,
	otp,
	title,
	intro,
}: {
	to: string;
	otp: string;
	title: string;
	intro: string;
}) {
	const transporter = getTransporter();
	const expiryMinutes = Number(process.env.OTP_EXPIRES_MINUTES || 10);

	await transporter.sendMail({
		from: EMAIL_FROM,
		to,
		subject: `${APP_NAME} - ${title}`,
		text: `${intro} ${otp}. Kode ini berlaku selama ${expiryMinutes} menit.`,
		html: `
			<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #18181b;">
				<h2 style="margin-bottom: 8px;">${title}</h2>
				<p>${intro}</p>
				<div style="margin: 24px 0; font-size: 32px; font-weight: 700; letter-spacing: 8px;">
					${otp}
				</div>
				<p>Kode ini berlaku selama ${expiryMinutes} menit.</p>
				<p>Jika Anda tidak meminta login, abaikan email ini.</p>
			</div>
		`,
	});
}

const COOKIE_NAME = "bimastore_owner_session";
const SESSION_SECONDS = 60 * 60 * 4;

type OwnerPayload = { sub: "owner"; exp: number; nonce: string };

function toBase64Url(bytes: Uint8Array) {
	let binary = "";
	bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
	return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
	const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
	const binary = atob(base64);
	return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function signingKey() {
	const secret = process.env.OWNER_SESSION_SECRET;
	if (!secret || secret.length < 32) throw new Error("OWNER_SESSION_SECRET belum dikonfigurasi dengan aman");
	return crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function createOwnerSession() {
	const payload: OwnerPayload = { sub: "owner", exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS, nonce: crypto.randomUUID() };
	const encoded = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
	const signature = await crypto.subtle.sign("HMAC", await signingKey(), new TextEncoder().encode(encoded));
	return `${encoded}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifyOwnerSession(token?: string | null) {
	if (!token) return false;
	try {
		const [encoded, signature] = token.split(".");
		if (!encoded || !signature) return false;
		const valid = await crypto.subtle.verify("HMAC", await signingKey(), fromBase64Url(signature), new TextEncoder().encode(encoded));
		if (!valid) return false;
		const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(encoded))) as OwnerPayload;
		return payload.sub === "owner" && payload.exp > Math.floor(Date.now() / 1000);
	} catch { return false; }
}

export { COOKIE_NAME, SESSION_SECONDS };

import { NextRequest, NextResponse } from "next/server";
import { findProduct, readProducts, writeProducts } from "@/lib/db";
import { Product } from "@/lib/types";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const product = findProduct(id);
	if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
	return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const payload = (await req.json()) as Partial<Product>;
	const list = readProducts();
	const idx = list.findIndex((p) => p.id === id);
	if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
	const updated: Product = {
		...list[idx],
		...payload,
		id: id,
		price: payload.price !== undefined ? Number(payload.price) : list[idx].price,
		featured: payload.featured !== undefined ? payload.featured : list[idx].featured,
	};
	list[idx] = updated;
	writeProducts(list);
	return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const list = readProducts();
	const next = list.filter((p) => p.id !== id);
	if (next.length === list.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
	writeProducts(next);
	return NextResponse.json({ ok: true });
}



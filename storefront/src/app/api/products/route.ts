import { NextRequest, NextResponse } from "next/server";
import { readProducts, writeProducts } from "@/lib/db";
import { Product } from "@/lib/types";
import crypto from "crypto";

export const dynamic = 'error';

export async function GET() {
	const items = readProducts();
	return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
	const body = (await req.json()) as Partial<Product>;
	if (!body.title || !body.price || !body.image || !body.category) {
		return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
	}
	const list = readProducts();
	const product: Product = {
		id: body.id || crypto.randomUUID(),
		title: body.title!,
		description: body.description ?? "",
		price: Number(body.price),
		originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
		image: body.image!,
		images: body.images || [body.image!],
		category: body.category!,
		navCategory: body.navCategory || "",
		badge: body.badge,
		stock: body.stock ?? 100,
		sold: body.sold ?? 0,
		rating: body.rating ?? 0,
		reviewCount: body.reviewCount ?? 0,
		featured: body.featured !== undefined ? body.featured : true,
		shop: body.shop || {
			id: "shop-1",
			name: "Bima Store",
			rating: 4.8,
		},
		variants: body.variants,
	};
	writeProducts([product, ...list]);
	return NextResponse.json(product, { status: 201 });
}




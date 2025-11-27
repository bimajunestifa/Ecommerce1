import { NextRequest, NextResponse } from "next/server";
import { readReviews, createReview, findReviewsByProductId } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
	const productId = req.nextUrl.searchParams.get("productId");
	if (productId) {
		const reviews = findReviewsByProductId(productId);
		return NextResponse.json({ reviews });
	}
	return NextResponse.json({ reviews: readReviews() });
}

export async function POST(req: NextRequest) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { productId, rating, comment, images } = await req.json();

		if (!productId || !rating || !comment) {
			return NextResponse.json({ error: "ProductId, rating, dan comment diperlukan" }, { status: 400 });
		}

		const userData = await import("@/lib/db").then(m => m.findUserById(user.userId));
		if (!userData) {
			return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
		}

		const review = createReview({
			productId,
			userId: user.userId,
			userName: userData.name,
			userAvatar: userData.avatar,
			rating: Number(rating),
			comment,
			images: images || [],
		});

		return NextResponse.json({ review, message: "Review berhasil ditambahkan" });
	} catch (error) {
		return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
	}
}

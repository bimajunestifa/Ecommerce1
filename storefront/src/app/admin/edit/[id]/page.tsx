import EditProductClient from "./EditProductClient";
import { readProducts } from "@/lib/db";

// Required for static export - generate all product edit pages at build time
export async function generateStaticParams() {
	const products = readProducts();
	return products.map((product) => ({
		id: product.id,
	}));
}

export default function EditProductPage() {
	return <EditProductClient />;
}

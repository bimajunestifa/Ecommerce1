import ProductGrid from "@/components/ProductGrid";
import StorefrontHero from "@/components/StorefrontHero";

export default function Home() {
  return (
    <div className="bg-white dark:bg-black">
	  <StorefrontHero />
      <ProductGrid />
    </div>
  );
}

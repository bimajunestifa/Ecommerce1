import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/cart/CartContext";
import { AuthProvider } from "@/components/AuthContext";

export const metadata: Metadata = {
  title: {
    default: "BimaStore — Premium Sports & Lifestyle",
    template: "%s | BimaStore",
  },
  description: "Ecommerce premium terinspirasi Nike: sepatu, apparel, dan aksesori.",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "BimaStore",
    description: "Belanja sepatu lari, training, dan lifestyle.",
    url: "https://localhost:3000",
    siteName: "BimaStore",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
	<html lang="id">
	  <body className="antialiased">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

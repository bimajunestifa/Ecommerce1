import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/cart/CartContext";
import { AuthProvider } from "@/components/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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

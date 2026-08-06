import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { WishlistDrawer } from "@/components/layout/WishlistDrawer";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Velocity Shoes — Move Beyond Limits",
    template: "%s — Velocity Shoes",
  },
  description:
    "Premium performance sneakers and streetwear engineered for speed, comfort, and everyday style. Move beyond limits with Velocity Shoes.",
  keywords: [
    "Velocity Shoes",
    "luxury sneakers",
    "premium footwear",
    "streetwear",
    "running shoes",
    "basketball shoes",
  ],
  openGraph: {
    title: "Velocity Shoes — Move Beyond Limits",
    description:
      "Premium performance sneakers and streetwear engineered for speed, comfort, and everyday style.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-fg bg-noise selection:bg-brand selection:text-black">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <WishlistDrawer />
        </Providers>
      </body>
    </html>
  );
}

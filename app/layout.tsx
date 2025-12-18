// app/layout.tsx
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext"; 
import CartDrawer from "@/components/CartDrawer";
import type { Metadata, Viewport } from "next"; // 1. Import Viewport type

export const metadata: Metadata = {
  title: "Perfume Box | Luxury You Can Smell",
  description: "Authentic and Premium Perfumes in Bangladesh. Discover luxury.",
};

// 2. ADD THIS VIEWPORT EXPORT
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Optional: Prevents users from zooming in/out manually if you want a strict app-like feel
  // themeColor: "#000000", // Optional: Changes browser bar color
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body 
        className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-foreground)] antialiased"
        style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
      >
        <UserProvider>
          <CartProvider>
            <Header />
            <CartDrawer />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}